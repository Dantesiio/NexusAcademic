import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe
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
  @ApiOperation({ 
    summary: 'Crear una nueva entrega',
    description: 'Registra una nueva entrega en el sistema. Accesible para profesores y administradores.\nURL: POST /api/submissions'
  })
  @ApiBody({
    type: CreateSubmissionDto,
    description: 'Datos de la nueva entrega',
    examples: {
      ejemplo1: {
        value: {
          courseId: "123e4567-e89b-12d3-a456-426614174000",
          studentId: "987f6543-e21b-12d3-a456-426614174000",
          fileUrl: "https://drive.google.com/file/d/1234567890",
          comments: "Primera entrega del proyecto final"
        },
        summary: "Ejemplo de registro de entrega"
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Entrega creada correctamente.',
    type: Submission
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos o entrega duplicada.',
    schema: {
      example: {
        statusCode: 400,
        message: ['courseId must be a UUID', 'fileUrl must be a URL'],
        error: 'Bad Request'
      }
    }
  })
  create(@Body() dto: CreateSubmissionDto) {
    return this.svc.create(dto);
  }

  @Get()
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Listar entregas',
    description: 'Obtiene la lista completa de entregas. Accesible para profesores y administradores.\nURL: GET /api/submissions'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de entregas retornada.',
    type: [Submission]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado.'
  })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener una entrega',
    description: 'Busca y retorna una entrega específica por su UUID. Accesible para profesores y administradores.\nURL: GET /api/submissions/:id'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'UUID de la entrega',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Entrega encontrada.',
    type: Submission
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Entrega no encontrada.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Submission not found',
        error: 'Not Found'
      }
    }
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.findOne(id);
  }

  @Put(':id/grade')
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Calificar una entrega',
    description: 'Asigna una calificación a una entrega existente. Accesible para profesores y administradores.\nURL: PUT /api/submissions/:id/grade'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'UUID de la entrega a calificar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: GradeSubmissionDto,
    description: 'Datos de la calificación',
    examples: {
      ejemplo1: {
        value: {
          grade: 4.5,
          comments: "Excelente trabajo, muy bien documentado"
        },
        summary: "Ejemplo de calificación"
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Entrega calificada correctamente.',
    type: Submission
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Entrega no encontrada.'
  })
  grade(@Param('id', ParseUUIDPipe) id: string, @Body() dto: GradeSubmissionDto) {
    return this.svc.grade(id, dto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Eliminar una entrega',
    description: 'Elimina permanentemente una entrega del sistema. Solo accesible para administradores.\nURL: DELETE /api/submissions/:id'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'UUID de la entrega a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Entrega eliminada correctamente.',
    schema: {
      example: {
        message: 'Submission deleted successfully'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Entrega no encontrada.'
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.remove(id);
  }
}