import { IsString, IsEmail, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto{


    @ApiProperty({
        example: 'user@example.com',
        description: 'Correo electrónico del usuario',
    })
    @IsString()
    @IsEmail()
    email:string;


    @ApiProperty({
        example: 'strongPassword123',
        description: 'Contraseña del usuario (6–50 caracteres)',
        minLength: 6,
        maxLength: 50,
    })
    @IsString()
    @MaxLength(50)
    @MinLength(6)
    password: string;
}