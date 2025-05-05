import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { CreateSubmissionDto } from '../dto/create-submission.dto';
import { GradeSubmissionDto } from '../dto/grade-submission.dto';
import { CoursesService } from 'src/courses/service/courses.service';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly subRepo: Repository<Submission>,
    private readonly coursesService: CoursesService,
    private readonly studentsService: StudentsService,
  ) {}

  async create(dto: CreateSubmissionDto) {
    const course = await this.coursesService.findOne(dto.courseId);
    const student = await this.studentsService.findOne(dto.studentId);
    const exists = await this.subRepo.findOne({where : {course: {id: dto.courseId},
        student: {id: dto.studentId}}});
    if (exists) throw new BadRequestException('Submission already exists');

    const sub = this.subRepo.create({ ...dto, course, student });
    return this.subRepo.save(sub);
  }

  findAll() {
    return this.subRepo.find();
  }

  async findOne(id: string) {
    const sub = await this.subRepo.findOne({where: {id}});
    if (!sub) throw new NotFoundException(`Submission ${id} not found`);
    return sub;
  }

  async grade(id: string, dto: GradeSubmissionDto) {
    const sub = await this.findOne(id);
    sub.grade = dto.grade;
    sub.comments = dto.comments ?? sub.comments;
    return this.subRepo.save(sub);
  }

  async remove(id: string) {
    const sub = await this.findOne(id);
    await this.subRepo.remove(sub);
  }
}
