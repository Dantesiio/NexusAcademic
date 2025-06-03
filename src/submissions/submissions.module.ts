// src/submissions/submissions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionsService } from './service/submissions.service';
import { SubmissionsController } from './controller/submissions.controller';
import { CoursesModule } from '../courses/courses.module';
import { StudentsModule } from '../students/students.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission]),
    CoursesModule,
    StudentsModule,
    AuthModule,
  ],
  providers: [SubmissionsService],
  controllers: [SubmissionsController],
  exports: [SubmissionsService], // ← Agregar export
})
export class SubmissionsModule {}