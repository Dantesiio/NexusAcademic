import { Type } from "class-transformer";
import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { Grade } from "../entities/grade.entity";

// interface GradesInterface {
//     subject: string;
//     grade: string;
// }
export class CreateStudentDto {

    @IsString()
    name:string;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    age: number;

    @IsString()
    email:string;

    @IsString({ each: true })
    @IsArray()
    subjects: string[];

    @IsIn(['Male', 'Female', 'Other'])
    gender: string;

    @IsString()
    @IsOptional()
    nickname?:string;

    @IsArray()
    @IsOptional()
    grades: Grade[];
}
