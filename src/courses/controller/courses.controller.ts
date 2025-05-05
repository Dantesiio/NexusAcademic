import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { CoursesService } from 'src/courses/service/courses.service';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { UpdateCourseDto } from 'src/courses/dto/update-course.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Controller('courses')
export class CoursesController {
  constructor(private readonly svc: CoursesService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  create(@Body() dto: CreateCourseDto) {
    return this.svc.create(dto);
  }

  @Get()
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCourseDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.remove(id);
  }
}
