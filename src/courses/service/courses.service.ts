import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { User } from '../../auth/entities/user.entity';
import { Enrollment } from 'src/students/entities/enrollment.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  async create(dto: CreateCourseDto) {
    const teacher = await this.userRepo.findOne({ where: { id: dto.teacherId } });
    if (!teacher) throw new NotFoundException('Teacher not found');

    if (new Date(dto.endDate) < new Date(dto.startDate))
      throw new BadRequestException('endDate must be after startDate');

    const course = this.courseRepo.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      teacher,
    });
    return this.courseRepo.save(course);
  }

  async findAll() {
    return this.courseRepo.find({
      relations: ['enrollments', 'enrollments.student'],
    });
  }

  async findOne(id: string) {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['enrollments', 'enrollments.student'],
    });
    if (!course) throw new NotFoundException(`Course ${id} not found`);
    return course;
  }

  async update(id: string, dto: UpdateCourseDto) {
    const course = await this.findOne(id);
    if (dto.teacherId) {
      const teacher = await this.userRepo.findOne({ where: { id: dto.teacherId } });
      if (!teacher) throw new NotFoundException('Teacher not found');
      course.teacher = teacher;
    }
    Object.assign(course, dto);
    return this.courseRepo.save(course);
  }

  async remove(id: string) {
    const course = await this.findOne(id);
    await this.courseRepo.remove(course);
  }
}
