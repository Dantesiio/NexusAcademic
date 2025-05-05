import { IsNumber, Min, Max, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GradeSubmissionDto {
  @ApiProperty({ example: 4.5, minimum: 0, maximum: 5, description: 'Calificación (0–5)' })
  @IsNumber()
  @Min(0)
  @Max(5)
  grade: number;

  @ApiPropertyOptional({ example: 'Buen trabajo', description: 'Comentarios adicionales' })
  @IsString()
  @IsOptional()
  comments?: string;
}
