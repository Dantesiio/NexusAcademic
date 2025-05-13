import { PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';

/**
 * @description DTO para actualizar un usuario
 * @example {
 *   "email": "nuevo.email@example.com",
 *   "fullName": "Nombre Actualizado",
 *   "password": "NuevaContraseña123"
 * }
 */
export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
