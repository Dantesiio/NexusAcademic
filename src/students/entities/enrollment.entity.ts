import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from './student.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('enrollments')
export class Enrollment {
  @ApiProperty({
    description: 'ID único de la matrícula',
    example: 'uuid-v4',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Estudiante matriculado',
    type: () => Student,
  })
  @ManyToOne(() => Student, (student) => student.enrollments, { eager: true })
  student: Student;

  @ApiProperty({
    description: 'Curso en el que se matriculó el estudiante',
    type: () => Course,
  })
  @ManyToOne(() => Course, (course) => course.enrollments, { eager: true })
  course: Course;

  @ApiProperty({
    description: 'Fecha de matrícula',
    example: '2025-05-17',
  })
  @Column('date')
  enrolledAt: Date;

  @ApiProperty({
    description: 'Calificación del estudiante en el curso',
    example: 95,
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  score?: number;
}
