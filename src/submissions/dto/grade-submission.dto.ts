import { IsNumber, Min, Max, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GradeSubmissionDto {
  @ApiProperty({
    description: 'Calificación numérica de la entrega',
    example: 4.5,
    minimum: 0,
    maximum: 5,
    type: Number,
    format: 'float',
    default: null
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  grade: number;

  @ApiPropertyOptional({
    description: 'Comentarios o retroalimentación sobre la calificación',
    example: 'Excelente trabajo. La documentación es clara y el código está bien estructurado.',
    minLength: 1,
    maxLength: 500,
    default: ''
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  comments?: string;
}
