import { IsUUID, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  courseId: string;

  @IsUUID()
  studentId: string;

  @IsString() @IsNotEmpty()
  fileUrl: string;

  @IsString() @IsOptional()
  comments?: string;
}
