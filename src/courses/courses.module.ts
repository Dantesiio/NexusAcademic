import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CoursesService } from '../courses/service/courses.service';
import { CoursesController } from '../courses/controller/courses.controller';
import { AuthModule } from '../auth/auth.module';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, User]),
    AuthModule,
  ],
  providers: [CoursesService],
  controllers: [CoursesController],
  exports: [ CoursesService]
})
export class CoursesModule {}
