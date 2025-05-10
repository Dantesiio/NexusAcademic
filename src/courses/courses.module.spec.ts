// src/courses/courses.module.spec.ts
import { Test } from '@nestjs/testing';
import { CoursesModule } from '../courses/courses.module';
import { CoursesService } from './service/courses.service';
import { CoursesController } from './controller/courses.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { User } from '../auth/entities/user.entity';

describe('CoursesModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
      controllers: [CoursesController],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(CoursesService)).toBeInstanceOf(CoursesService);
    expect(module.get(CoursesController)).toBeInstanceOf(CoursesController);
  });
});