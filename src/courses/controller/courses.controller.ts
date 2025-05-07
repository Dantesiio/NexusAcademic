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
import { CoursesService } from '../../../src/courses/service/courses.service';
import { CreateCourseDto } from '../../../src/courses/dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Auth } from '../../../src/auth/decorators/auth.decorator';
import { ValidRoles } from '../../../src/auth/enums/valid-roles.enum';

@ApiTags('Courses')
@ApiBearerAuth('JWT-auth')
@Controller('courses')
export class CoursesController {
  constructor(private readonly svc: CoursesService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear un nuevo curso (admin o super-user)' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({ status: 201, description: 'Curso creado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o conflicto de código.' })
  create(@Body() dto: CreateCourseDto) {
    return this.svc.create(dto);
  }

  @Get()
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todos los cursos (teacher o admin)' })
  @ApiResponse({ status: 200, description: 'Lista de cursos retornada.' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener un curso por UUID (teacher o admin)' })
  @ApiParam({ name: 'id', description: 'UUID del curso' })
  @ApiResponse({ status: 200, description: 'Curso encontrado.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar un curso por UUID (solo admin)' })
  @ApiParam({ name: 'id', description: 'UUID del curso' })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({ status: 200, description: 'Curso actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseDto
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar un curso por UUID (solo admin)' })
  @ApiParam({ name: 'id', description: 'UUID del curso' })
  @ApiResponse({ status: 200, description: 'Curso eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.remove(id);
  }
}
