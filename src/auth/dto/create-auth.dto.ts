import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
    @ApiProperty({
        description: 'Correo electrónico único del usuario',
        example: 'profesor@example.com',
        format: 'email',
        uniqueItems: true
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'Abc123456',
        minLength: 6,
        maxLength: 50,
        writeOnly: true,
        format: 'password'
    })
    @IsString()
    @MaxLength(50)
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: 'Nombre completo del usuario',
        example: 'Juan Pérez González',
        minLength: 1,
        maxLength: 100
    })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    fullName: string;
    
}
