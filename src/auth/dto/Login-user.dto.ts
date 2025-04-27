import { IsString, IsEmail, MaxLength, MinLength } from "class-validator";

export class LoginUserDto{
    
    @IsString()
    @IsEmail()
    email:string;
   
    @IsString()
    @MaxLength(50)
    @MinLength(6)
    password: string;
}