import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Enrollment } from './entities/enrollment.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  imports:[
    TypeOrmModule.forFeature([Student, Enrollment]),
    AuthModule
  ],
  exports: [StudentsService]
})
export class StudentsModule {}
