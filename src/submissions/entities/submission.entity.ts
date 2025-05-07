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
import { Course } from '../../courses/entities/course.entity';
import { Student } from '../../students/entities/student.entity';

@Entity('submissions')
@Unique(['course', 'student'])
export class Submission {
  @ApiProperty({
    description: 'Identificador único de la entrega',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Curso asociado a la entrega',
    type: () => Course,
  })
  @ManyToOne(() => Course, { eager: true, onDelete: 'CASCADE' })
  course: Course;

  @ApiProperty({
    description: 'Estudiante asociado a la entrega',
    type: () => Student,
  })
  @ManyToOne(() => Student, { eager: true, onDelete: 'CASCADE' })
  student: Student;

  @ApiProperty({
    description: 'URL o ruta del archivo entregado',
    example: 'https://drive.google.com/file/xxx',
  })
  @Column('text')
  fileUrl: string;

  @ApiProperty({
    description: 'Comentarios opcionales sobre la entrega',
    example: 'Primera entrega del proyecto final.',
    default: '',
  })
  @Column('text', { default: '' })
  comments: string;

  @ApiProperty({
    description: 'Calificación de la entrega',
    example: 95,
    nullable: true,
  })
  @Column('numeric', { nullable: true })
  grade: number | null;

  @ApiProperty({
    description: 'Fecha y hora en que se realizó la entrega',
    example: '2023-10-01T12:00:00Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submittedAt: Date;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2023-10-01T12:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del registro',
    example: '2023-10-02T12:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}