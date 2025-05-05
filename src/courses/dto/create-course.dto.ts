import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { CourseStatus } from '../enums/course-status.enum';

export class CreateCourseDto {
  @IsString() @IsNotEmpty()
  name: string;

  @IsString() @IsNotEmpty()
  description: string;

  @IsString() @IsNotEmpty()
  code: string;

  @IsUUID()
  teacherId: string;

  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
