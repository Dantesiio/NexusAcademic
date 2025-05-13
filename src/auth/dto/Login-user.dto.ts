import { IsString, IsEmail, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({
        description: 'Correo electrónico registrado del usuario',
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
        writeOnly: true
    })
    @IsString()
    @MaxLength(50)
    @MinLength(6)
    password: string;
}