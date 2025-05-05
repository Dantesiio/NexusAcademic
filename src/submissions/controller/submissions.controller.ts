import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SubmissionsService } from 'src/submissions/service/submissions.service';
import { CreateSubmissionDto } from 'src/submissions/dto/create-submission.dto';
import { GradeSubmissionDto } from 'src/submissions/dto/grade-submission.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly svc: SubmissionsService) {}

  @Post()
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  create(@Body() dto: CreateSubmissionDto) {
    return this.svc.create(dto);
  }

  @Get()
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Put(':id/grade')
  @Auth(ValidRoles.teacher, ValidRoles.admin)
  grade(@Param('id') id: string, @Body() dto: GradeSubmissionDto) {
    return this.svc.grade(id, dto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
