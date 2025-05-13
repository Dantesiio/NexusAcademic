// src/submissions/submissions.module.spec.ts
import { Test } from '@nestjs/testing';
import { SubmissionsModule } from '../submissions/submissions.module';
import { SubmissionsService } from '../submissions/service/submissions.service';
import { SubmissionsController } from '../submissions/controller/submissions.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Submission } from '../submissions/entities/submission.entity';
import { CoursesService } from '../courses/service/courses.service';
import { StudentsService } from '../students/students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

describe('SubmissionsModule', () => {
  let service: SubmissionsService;
  let controller: SubmissionsController;

  beforeEach(async () => {
    // Creamos mocks para los servicios y repositorios que necesita SubmissionsService
    const mockSubmissionRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const mockCoursesService = {
      findOne: jest.fn(),
    };

    const mockStudentsService = {
      findOne: jest.fn(),
    };

    const module = await Test.createTestingModule({
      // No importamos el módulo completo, solo sus componentes esenciales
      controllers: [SubmissionsController],
      providers: [
        SubmissionsService,
        {
          provide: getRepositoryToken(Submission),
          useValue: mockSubmissionRepository,
        },
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
      ],
    }).compile();

    service = module.get<SubmissionsService>(SubmissionsService);
    controller = module.get<SubmissionsController>(SubmissionsController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('should provide SubmissionsService', () => {
    expect(service).toBeInstanceOf(SubmissionsService);
  });

  it('should provide SubmissionsController', () => {
    expect(controller).toBeInstanceOf(SubmissionsController);
  });
});