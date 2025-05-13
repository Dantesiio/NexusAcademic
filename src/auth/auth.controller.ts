import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/Login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';
import { Auth } from './decorators/auth.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Registrar un nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema. Solo accesible para administradores y super usuarios.\nURL: POST /api/auth/register'
  })
  @ApiBody({
    type: CreateAuthDto,
    description: 'Datos del nuevo usuario',
    examples: {
      ejemplo1: {
        value: {
          email: "profesor@example.com",
          password: "Abc123456",
          fullName: "Juan Pérez"
        },
        summary: "Ejemplo de registro de profesor"
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado con éxito.',
    schema: {
      example: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "profesor@example.com",
        fullName: "Juan Pérez",
        isActive: true,
        roles: ["teacher"]
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos en el payload.',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email', 'password must be longer than 6 characters'],
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized'
      }
    }
  })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y retorna un token JWT.\nURL: POST /api/auth/login'
  })
  @ApiBody({
    type: LoginUserDto,
    description: 'Credenciales de acceso',
    examples: {
      ejemplo1: {
        value: {
          email: "profesor@example.com",
          password: "Abc123456"
        },
        summary: "Ejemplo de credenciales"
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso.',
    schema: {
      example: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "profesor@example.com",
          fullName: "Juan Pérez",
          roles: ["teacher"]
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciales incorrectas',
        error: 'Unauthorized'
      }
    }
  })
  login(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Verificar estado de autenticación',
    description: 'Verifica el estado de autenticación del usuario actual y renueva el token.\nURL: GET /api/auth/check-status'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado de autenticación verificado.',
    schema: {
      example: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "profesor@example.com",
          fullName: "Juan Pérez",
          roles: ["teacher"]
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado o token inválido.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token no válido o expirado',
        error: 'Unauthorized'
      }
    }
  })
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return {
      user,
      message: 'Token válido'
    };
  }

  @Post('logout')
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Cerrar sesión',
    description: 'Cierra la sesión del usuario actual e invalida el token JWT.\nURL: POST /api/auth/logout'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sesión cerrada exitosamente.',
    schema: {
      example: {
        message: 'Sesión cerrada exitosamente'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado o token inválido.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token no válido o no proporcionado',
        error: 'Unauthorized'
      }
    }
  })
  logout(@Headers('authorization') authHeader: string) {
    return this.authService.logout(authHeader);
  }
}
