import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Student } from './entities/student.entity';
import { Enrollment } from './entities/enrollment.entity';// Asegúrate que esté bien la ruta
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from 'src/commons/dto/pagination.dto';

import { isUUID } from 'class-validator';

@Injectable()
export class StudentsService {
  private logger = new Logger('StudentsService');

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    try {
      const { enrollments = [], ...studentDetails } = createStudentDto;

      const student = this.studentRepository.create({
        ...studentDetails,
        enrollments: enrollments.map((enrollment) =>
          this.enrollmentRepository.create(enrollment),
        ),
      });

      await this.studentRepository.save(student);
      return student;
    } catch (error) {
      this.logger.error(error);
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      return await this.studentRepository.find({
        take: limit,
        skip: offset,
        relations: ['enrollments'],
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(term: string) {
    let student: Student | null;

    if (isUUID(term)) {
      student = await this.studentRepository.findOne({
        where: { id: term },
        relations: ['enrollments'],
      });
    } else {
      const queryBuilder = this.studentRepository.createQueryBuilder('student');
      student = await queryBuilder
        .where('UPPER(student.name) = :name OR student.nickname = :nickname', {
          name: term.toUpperCase(),
          nickname: term.toLowerCase(),
        })
        .leftJoinAndSelect('student.enrollments', 'studentEnrollments')
        .getOne();
    }

    if (!student)
      throw new NotFoundException(`Student with ${term} not found`);

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const { enrollments, ...studentDetails } = updateStudentDto;

    const student = await this.studentRepository.preload({
      id,
      ...studentDetails,
    });

    if (!student)
      throw new NotFoundException(`Student with id ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (enrollments) {
        await queryRunner.manager.delete(Enrollment, { student: { id } });

        student.enrollments = enrollments.map((enrollment) =>
          this.enrollmentRepository.create(enrollment),
        );
      }

      await queryRunner.manager.save(student);
      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
  }

  async deleteAllStudents() {
    const query = this.studentRepository.createQueryBuilder();
    try {
      return query.delete().where({}).execute();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
