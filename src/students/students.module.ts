import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Grade } from './entities/grade.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  imports:[
    TypeOrmModule.forFeature([Student, Grade]),
    AuthModule
  ],
  exports: [StudentsService]
})
export class StudentsModule {}
