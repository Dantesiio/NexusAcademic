import { PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';

/**
 * @description DTO para actualizar un estudiante
 * @example {
 *   "name": "Juan Pérez Actualizado",
 *   "age": 21,
 *   "subjects": ["Matemáticas", "Física", "Programación"],
 *   "nickname": "juanp21"
 * }
 */
export class UpdateStudentDto extends PartialType(CreateStudentDto) {}