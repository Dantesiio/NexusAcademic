import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req,  Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/Login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './enums/valid-roles.enum';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @Auth(ValidRoles.teacher)
  privateRoute(
    //@Req() request: Express.Request
    @GetUser() user: User
    //@RawHeaders() rawHeaders: string[],
    //@Headers() headers: IncomingHttpHeaders
   
  ){
    console.log("🚀 ~ :34 ~ AuthController ~ headers:", user)
    //console.log("🚀 ~ :27 ~ AuthController ~ request:", rawHeaders)
    return{
      ok: true,
      message: 'Success!'
    }
  }



}
