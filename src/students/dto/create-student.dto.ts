import { Type } from "class-transformer";
import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength, IsEmail } from "class-validator";
import { Grade } from "../entities/grade.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

// interface GradesInterface {
//     subject: string;
//     grade: string;
// }
export class CreateStudentDto {
    @ApiProperty({
        description: 'Nombre completo del estudiante',
        example: 'Juan Pérez',
        minLength: 1
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'Edad del estudiante',
        example: 20,
        minimum: 1
    })
    @IsNumber()
    @IsOptional()
    @IsPositive()
    age: number;

    @ApiProperty({
        description: 'Correo electrónico del estudiante',
        example: 'juan.perez@example.com'
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Lista de materias en las que está inscrito',
        example: ['Matemáticas', 'Física', 'Química'],
        type: [String]
    })
    @IsString({ each: true })
    @IsArray()
    subjects: string[];

    @ApiProperty({
        description: 'Género del estudiante',
        example: 'Male',
        enum: ['Male', 'Female', 'Other']
    })
    @IsIn(['Male', 'Female', 'Other'])
    gender: string;

    @ApiPropertyOptional({
        description: 'Apodo o nombre de usuario del estudiante',
        example: 'juanp20',
        minLength: 1
    })
    @IsString()
    @IsOptional()
    nickname?: string;

    @ApiPropertyOptional({
        description: 'Calificaciones del estudiante',
        type: [Grade]
    })
    @IsArray()
    @IsOptional()
    grades: Grade[];
}
