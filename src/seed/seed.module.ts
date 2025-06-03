import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { StudentsModule } from '../students/students.module';
import { AuthModule } from '../auth/auth.module';
import { CoursesModule } from '../courses/courses.module';
import { SubmissionsModule } from '../submissions/submissions.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    StudentsModule, 
    AuthModule, 
    CoursesModule,
    SubmissionsModule  // ← Agregamos el SubmissionsModule
  ]
})
export class SeedModule {}