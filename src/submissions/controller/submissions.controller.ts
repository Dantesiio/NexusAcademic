import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { SubmissionsService } from '../service/submissions.service';
import { CreateSubmissionDto } from '../dto/create-submission.dto';
import { GradeSubmissionDto } from '../dto/grade-submission.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ValidRoles } from '../../auth/enums/valid-roles.enum';

@ApiTags('Submissions')
@ApiBearerAuth('JWT-auth')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly svc: SubmissionsService) {}

  @Post()
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear una nueva entrega (teacher o admin)' })
  @ApiBody({ type: CreateSubmissionDto })
  @ApiResponse({ status: 201, description: 'Entrega creada correctamente.' })
  @ApiResponse({ status: 400, description: 'Entrega ya existe o datos inválidos.' })
  create(@Body() dto: CreateSubmissionDto) {
    return this.svc.create(dto);
  }

  @Get()
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todas las entregas (teacher o admin)' })
  @ApiResponse({ status: 200, description: 'Lista de entregas retornada.' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener una entrega por UUID (teacher o admin)' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiResponse({ status: 200, description: 'Entrega encontrada.' })
  @ApiResponse({ status: 404, description: 'Entrega no encontrada.' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Put(':id/grade')
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Calificar una entrega (teacher o admin)' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega a calificar' })
  @ApiBody({ type: GradeSubmissionDto })
  @ApiResponse({ status: 200, description: 'Entrega calificada correctamente.' })
  @ApiResponse({ status: 404, description: 'Entrega no encontrada.' })
  grade(@Param('id') id: string, @Body() dto: GradeSubmissionDto) {
    return this.svc.grade(id, dto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar una entrega por UUID (solo admin)' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiResponse({ status: 200, description: 'Entrega eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Entrega no encontrada.' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}