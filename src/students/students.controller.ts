import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../commons/dto/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { Student } from './entities/student.entity';

@ApiTags('Students')
@ApiBearerAuth('JWT-auth')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Crear un nuevo estudiante',
    description: 'Crea un nuevo estudiante en el sistema. Solo accesible para administradores.\nURL: POST /api/students'
  })
  @ApiBody({
    type: CreateStudentDto,
    description: 'Datos del nuevo estudiante',
    examples: {
      ejemplo1: {
        value: {
          name: "Juan Pérez",
          age: 20,
          email: "juan.perez@example.com",
          subjects: ["Matemáticas", "Física"],
          gender: "Male",
          nickname: "juanp20"
        },
        summary: "Ejemplo de registro de estudiante"
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Estudiante creado correctamente.',
    type: Student
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos en el payload.',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email', 'age must be a positive number'],
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
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Listar estudiantes',
    description: 'Obtiene la lista de estudiantes con paginación. Solo accesible para administradores.\nURL: GET /api/students'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Número máximo de resultados',
    example: 10
  })
  @ApiQuery({ 
    name: 'offset', 
    required: false, 
    type: Number, 
    description: 'Número de resultados a omitir',
    example: 0
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de estudiantes retornada.',
    type: [Student]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado.'
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.studentsService.findAll(paginationDto);
  }

  @Get(':term')
  @Auth(ValidRoles.admin, ValidRoles.teacher)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Buscar estudiante',
    description: 'Busca un estudiante por UUID, nombre o nickname. Accesible para profesores y administradores.\nURL: GET /api/students/:term'
  })
  @ApiParam({ 
    name: 'term', 
    description: 'Término de búsqueda (UUID, nombre o nickname)',
    example: 'juan.perez@example.com'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estudiante encontrado.',
    type: Student
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Estudiante no encontrado.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Estudiante no encontrado',
        error: 'Not Found'
      }
    }
  })
  findOne(@Param('term') term: string) {
    return this.studentsService.findOne(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Actualizar estudiante',
    description: 'Actualiza los datos de un estudiante existente. Solo accesible para administradores.\nURL: PATCH /api/students/:id'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'UUID del estudiante',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateStudentDto,
    description: 'Datos a actualizar del estudiante',
    examples: {
      ejemplo1: {
        value: {
          age: 21,
          subjects: ["Matemáticas", "Física", "Química"]
        },
        summary: "Actualización parcial de estudiante"
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estudiante actualizado correctamente.',
    type: Student
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Estudiante no encontrado.'
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDto
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Eliminar estudiante',
    description: 'Elimina permanentemente un estudiante del sistema. Solo accesible para administradores.\nURL: DELETE /api/students/:id'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'UUID del estudiante a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estudiante eliminado correctamente.',
    schema: {
      example: {
        message: 'Student deleted successfully'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Estudiante no encontrado.'
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.remove(id);
  }
}
