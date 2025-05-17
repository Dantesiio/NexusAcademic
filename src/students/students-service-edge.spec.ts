import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { Student } from '../students/entities/student.entity';
import { Grade } from './entities/enrollment.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { UpdateStudentDto } from '../students/dto/update-student.dto';

describe('StudentsService Edge Cases', () => {
  let service: StudentsService;
  let studentRepository: any;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            preload: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
              delete: jest.fn().mockReturnThis(),
              execute: jest.fn(),
            })),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Grade),
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    studentRepository = module.get(getRepositoryToken(Student));
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();

    // Suppress console error logs during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle findAll with error', async () => {
    studentRepository.find.mockRejectedValue(new Error('Database error'));
    
    await expect(service.findAll({})).rejects.toThrow(InternalServerErrorException);
  });

  it('should handle database error in create method', async () => {
    const createDto = { 
      name: 'Test Student',
      email: 'test@example.com',
      gender: 'Male',
      subjects: ['Math'],
      age: 20,        // Add the missing required property
      grades: []      // Add the missing required property (as an empty array)
    };
    
    studentRepository.create.mockReturnValue(createDto);
    studentRepository.save.mockRejectedValue({ code: 'UNKNOWN', detail: 'DB error' });
    
    await expect(service.create(createDto)).rejects.toThrow(InternalServerErrorException);
  });

  it('should handle update with transaction error', async () => {
    const student = { id: 'id', name: 'Test' };
    studentRepository.preload.mockResolvedValue(student);
    
    // Instead of mocking startTransaction to throw,
    // let's mock manager.save to throw since that would trigger our error handler
    jest.spyOn(queryRunner.manager, 'save').mockRejectedValue(new Error('DB error'));
    
    const updateDto: UpdateStudentDto = { name: 'Updated' };
    
    await expect(service.update('id', updateDto)).rejects.toThrow(InternalServerErrorException);
    
    // Verify the transaction was rolled back
    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });
});