// src/students/students.module.spec.ts
import { Test } from '@nestjs/testing';
import { StudentsModule } from '../students/students.module';
import { StudentsService } from '../students/students.service';
import { StudentsController } from '../students/students.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from '../students/entities/student.entity';
import { Grade } from '../students/entities/grade.entity';
import { DataSource } from 'typeorm';

describe('StudentsModule', () => {
  let service: StudentsService;
  let controller: StudentsController;

  beforeEach(async () => {
    // Mock para los repositorios y DataSource
    const mockStudentRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
      preload: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        delete: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      })),
    };

    const mockGradeRepository = {
      create: jest.fn((dto) => dto),
    };

    const mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
        delete: jest.fn(),
      },
    };

    const mockDataSource = {
      createQueryRunner: jest.fn(() => mockQueryRunner),
    };

    const module = await Test.createTestingModule({
      // No importamos el módulo completo, solo sus componentes esenciales
      controllers: [StudentsController],
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockStudentRepository,
        },
        {
          provide: getRepositoryToken(Grade),
          useValue: mockGradeRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    controller = module.get<StudentsController>(StudentsController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('should provide StudentsService', () => {
    expect(service).toBeInstanceOf(StudentsService);
  });

  it('should provide StudentsController', () => {
    expect(controller).toBeInstanceOf(StudentsController);
  });
});