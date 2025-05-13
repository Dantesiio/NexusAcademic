import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Ejecutar seed de datos',
    description: 'Inicializa la base de datos con datos de prueba.\nURL: GET /api/seed'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Seed ejecutado correctamente.',
    schema: {
      example: {
        message: 'Seed executed successfully',
        users: 5,
        courses: 10,
        students: 20,
        submissions: 30
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Error al ejecutar el seed.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error executing seed',
        error: 'Internal Server Error'
      }
    }
  })
  executeSeed() {
    return this.seedService.runSeed();
  }
}
