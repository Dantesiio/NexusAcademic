import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {

    @ApiProperty({ example: 'user@example.com', description: 'Correo electrónico' })
    @IsString()
    @IsEmail()
    email:string;

    @ApiProperty({ example: 'strongPassword', description: 'Contraseña (6–50 chars)' })
    @IsString()
    @MaxLength(50)
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
    @IsString()
    fullName: string;
    
}
