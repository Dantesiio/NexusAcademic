import { IsNumber, Min, Max, IsOptional, IsString } from 'class-validator';

export class GradeSubmissionDto {
  @IsNumber() @Min(0) @Max(5)
  grade: number;

  @IsString() @IsOptional()
  comments?: string;
}
