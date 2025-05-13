import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';

/**
 * @description DTO para actualizar un curso
 * @example {
 *   "name": "Curso Actualizado de NestJS",
 *   "description": "Descripción actualizada del curso",
 *   "teacherId": "123e4567-e89b-12d3-a456-426614174000",
 *   "status": "ACTIVE",
 *   "startDate": "2025-06-01",
 *   "endDate": "2025-07-01"
 * }
 */
export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
