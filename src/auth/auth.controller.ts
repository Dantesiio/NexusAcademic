import { Controller, Get, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/Login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';
import { Auth } from './decorators/auth.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado con éxito.' })
  @ApiBearerAuth('JWT-auth')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Retorna JWT.' })
  login(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @Auth(ValidRoles.teacher)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Ruta privada de ejemplo' })
  @ApiResponse({ status: 200, description: 'Acceso concedido.' })

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
