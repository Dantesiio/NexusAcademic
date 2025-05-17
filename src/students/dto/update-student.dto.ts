import { PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';

/**
 * @description DTO para actualizar un estudiante.
 * Todos los campos son opcionales.
 * Ahora admite actualizar las matrículas (enrollments) del estudiante,
 * incluyendo curso, fecha de matrícula y nota asociada.
 *
 * @example {
 *   "name": "Juan Pérez Actualizado",
 *   "age": 21,
 *   "email": "juan.actualizado@example.com",
 *   "nickname": "juanp21",
 *   "enrollments": [
 *     {
 *       "courseId": "abc123-uuid",
 *       "enrolledAt": "2025-05-10",
 *       "score": 88
 *     }
 *   ]
 * }
 */
export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
