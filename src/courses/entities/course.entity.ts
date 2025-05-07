import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/entities/user.entity';
import { CourseStatus } from '../enums/course-status.enum';

@Entity('courses')
@Unique(['code'])
export class Course {
  @ApiProperty({
    description: 'Identificador único del curso',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre del curso',
    example: 'Introducción a la Programación',
  })
  @Column('text')
  name: string;

  @ApiProperty({
    description: 'Descripción del curso',
    example: 'Este curso cubre los fundamentos de la programación en Python.',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'Código único del curso',
    example: 'CS101',
  })
  @Column('text')
  code: string;

  @ApiProperty({
    description: 'Profesor asignado al curso',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.id, { eager: true })
  teacher: User;

  @ApiProperty({
    description: 'Estado del curso',
    example: CourseStatus.ACTIVE,
    enum: CourseStatus,
    default: CourseStatus.ACTIVE,
  })
  @Column({ type: 'enum', enum: CourseStatus, default: CourseStatus.ACTIVE })
  status: CourseStatus;

  @ApiProperty({
    description: 'Fecha de inicio del curso',
    example: '2023-01-01',
  })
  @Column('date')
  startDate: Date;

  @ApiProperty({
    description: 'Fecha de finalización del curso',
    example: '2023-06-01',
  })
  @Column('date')
  endDate: Date;

  @ApiProperty({
    description: 'Fecha de creación del curso',
    example: '2023-01-01T12:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del curso',
    example: '2023-01-15T12:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}