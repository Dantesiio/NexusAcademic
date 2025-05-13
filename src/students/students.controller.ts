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
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../commons/dto/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@ApiTags('Students')
@ApiBearerAuth('JWT-auth')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear un nuevo estudiante (Requiere rol admin)' })
  @ApiResponse({ status: 201, description: 'Estudiante creado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos en el payload.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener lista de estudiantes (requiere rol admin)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número máximo de resultados' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Desplazamiento para paginación' })
  @ApiResponse({ status: 200, description: 'Lista de estudiantes retornada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.studentsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Buscar un estudiante por UUID, nombre o nickname' })
  @ApiParam({ name: 'term', description: 'UUID, nombre o nickname del estudiante' })
  @ApiResponse({ status: 200, description: 'Estudiante encontrado.' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado.' })
  findOne(@Param('term') term: string) {
    return this.studentsService.findOne(term);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un estudiante por UUID' })
  @ApiParam({ name: 'id', description: 'UUID del estudiante' })
  @ApiResponse({ status: 200, description: 'Estudiante actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDto
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un estudiante por UUID' })
  @ApiParam({ name: 'id', description: 'UUID del estudiante' })
  @ApiResponse({ status: 200, description: 'Estudiante eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.remove(id);
  }
}
