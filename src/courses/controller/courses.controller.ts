import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CoursesService } from '../service/courses.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ValidRoles } from '../../auth/enums/valid-roles.enum';
import { Course } from '../entities/course.entity';

@ApiTags('Courses')
@ApiBearerAuth('JWT-auth')
@Controller('courses')
export class CoursesController {
  constructor(private readonly svc: CoursesService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Crear un nuevo curso',
    description: 'Crea un nuevo curso en el sistema. Solo accesible para administradores y super usuarios.\nURL: POST /api/courses'
  })
  @ApiBody({ 
    type: CreateCourseDto,
    description: 'Datos del curso a crear',
    examples: {
      ejemplo1: {
        value: {
          name: "Programación Avanzada",
          description: "Curso de programación con patrones de diseño",
          code: "PRG-301",
          teacherId: "123e4567-e89b-12d3-a456-426614174000",
          startDate: "2024-03-15",
          endDate: "2024-07-15"
        },
        summary: "Ejemplo de curso básico"
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Curso creado correctamente.',
    type: Course
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos o conflicto de código.',
    schema: {
      example: {
        statusCode: 400,
        message: ['code must be a string', 'teacherId must be a UUID'],
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
  @ApiResponse({ 
    status: 404, 
    description: 'Ruta no encontrada. Asegúrate de usar el prefijo /api en la URL.',
    schema: {
      example: {
        statusCode: 404,
        message: "Cannot POST /courses. La URL correcta es /api/courses",
        error: "Not Found"
      }
    }
  })
  create(@Body() dto: CreateCourseDto) {
    return this.svc.create(dto);
  }

  @Get()
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Listar todos los cursos',
    description: 'Obtiene la lista completa de cursos. Accesible para profesores y administradores.\nURL: GET /api/courses'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de cursos retornada.',
    type: [Course]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado'
  })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener un curso por UUID',
    description: 'Busca y retorna un curso específico por su UUID. Accesible para profesores y administradores.\nURL: GET /api/courses/:id'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'UUID del curso',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Curso encontrado.',
    type: Course
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Curso no encontrado.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Course with UUID "123e4567-e89b-12d3-a456-426614174000" not found',
        error: 'Not Found'
      }
    }
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Actualizar un curso',
    description: 'Actualiza los datos de un curso existente. Solo accesible para administradores.\nURL: PUT /api/courses/:id'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'UUID del curso a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ 
    type: UpdateCourseDto,
    description: 'Datos a actualizar del curso',
    examples: {
      ejemplo1: {
        value: {
          name: "Programación Avanzada - Actualizado",
          description: "Curso actualizado de programación",
          startDate: "2024-04-15"
        },
        summary: "Actualización parcial de curso"
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Curso actualizado correctamente.',
    type: Course
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Curso no encontrado.'
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseDto
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Eliminar un curso',
    description: 'Elimina permanentemente un curso del sistema. Solo accesible para administradores.\nURL: DELETE /api/courses/:id'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'UUID del curso a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Curso eliminado correctamente.',
    schema: {
      example: {
        message: 'Course deleted successfully'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Curso no encontrado.'
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.remove(id);
  }
}
