import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsDateString, IsOptional,
} from 'class-validator';
import { CourseStatus } from '../enums/course-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Fundamentos de NestJS', description: 'Nombre del curso' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Aprende los fundamentos de NestJS', description: 'Descripción del curso' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'NJ-101', description: 'Código único del curso' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: '6c900015-cc93-42e9-a20f-728b0d785a20', description: 'UUID del profesor asignado' })
  @IsUUID()
  teacherId: string;

  @ApiPropertyOptional({
    example: CourseStatus.ACTIVE,
    enum: CourseStatus,
    description: 'Estado del curso',
  })
  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;

  @ApiProperty({ example: '2025-05-10', description: 'Fecha de inicio (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-06-10', description: 'Fecha de fin (YYYY-MM-DD)' })
  @IsDateString()
  endDate: string;
}