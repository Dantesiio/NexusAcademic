import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateEnrollmentInput {
  @ApiProperty({
    description: 'ID del curso al que el estudiante se matricula',
    example: 'uuid-del-curso',
  })
  @IsUUID()
  courseId: string;

  @ApiProperty({
    description: 'Fecha de matrícula',
    example: '2025-05-17',
  })
  @IsDateString()
  enrolledAt: string;

  @ApiPropertyOptional({
    description: 'Nota del estudiante en el curso (opcional)',
    example: 90,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score?: number;
}

export class CreateStudentDto {
  @ApiProperty({
    description: 'Nombre completo del estudiante',
    example: 'Juan Pérez',
    minLength: 1,
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Edad del estudiante',
    example: 20,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  age: number;

  @ApiProperty({
    description: 'Correo electrónico del estudiante',
    example: 'juan.perez@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Género del estudiante',
    example: 'Male',
    enum: ['Male', 'Female', 'Other'],
  })
  @IsIn(['Male', 'Female', 'Other'])
  gender: string;

  @ApiPropertyOptional({
    description: 'Apodo o nombre de usuario del estudiante',
    example: 'juanp20',
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({
    description: 'Matrículas (cursos y notas asociadas)',
    type: [CreateEnrollmentInput],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEnrollmentInput)
  @IsOptional()
  enrollments?: CreateEnrollmentInput[];
}
