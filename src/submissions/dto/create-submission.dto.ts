import { IsUUID, IsString, IsOptional, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({
    description: 'UUID del curso al que pertenece la entrega',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  courseId: string;

  @ApiProperty({
    description: 'UUID del estudiante que realiza la entrega',
    example: '987f6543-e21b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'URL del archivo o recurso entregado',
    example: 'https://drive.google.com/file/d/1234567890/view',
    format: 'uri'
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  fileUrl: string;

  @ApiPropertyOptional({
    description: 'Comentarios adicionales sobre la entrega',
    example: 'Entrega del proyecto final - Primera iteración',
    default: '',
    minLength: 1,
    maxLength: 500
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  comments?: string;
}
