import { IsUUID, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({ example: 'uuid-course', description: 'UUID del curso asociado' })
  @IsUUID()
  courseId: string;

  @ApiProperty({ example: 'uuid-student', description: 'UUID del estudiante' })
  @IsUUID()
  studentId: string;

  @ApiProperty({ example: 'https://drive.google.com/file/xxx', description: 'URL o ruta del archivo' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiPropertyOptional({ example: 'Primera entrega', description: 'Comentarios opcionales' })
  @IsString()
  @IsOptional()
  comments?: string;
}
