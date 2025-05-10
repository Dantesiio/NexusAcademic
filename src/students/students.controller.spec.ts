import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from '../../src/students/students.controller';
import { StudentsService } from '../../src/students/students.service';
import { CreateStudentDto } from '../../src/students/dto/create-student.dto';
import { UpdateStudentDto } from '../../src/students/dto/update-student.dto';
import { PaginationDto } from '../../src/commons/dto/pagination.dto';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  const mockStudentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new student', async () => {
      const dto: CreateStudentDto = {
        name: 'Test Student',
        age: 20,
        email: 'test@example.com',
        subjects: ['Math', 'Science'],
        gender: 'Male',
        grades: []
      };
      
      const student = {
        id: 'student-id',
        ...dto,
      };
      
      mockStudentsService.create.mockResolvedValue(student);

      const result = await controller.create(dto);

      expect(mockStudentsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(student);
    });
  });

  describe('findAll', () => {
    it('should return an array of students with pagination', async () => {
      const paginationDto: PaginationDto = { limit: 10, offset: 0 };
      const students = [
        { id: 'student-1', name: 'Student 1' },
        { id: 'student-2', name: 'Student 2' },
      ];
      
      mockStudentsService.findAll.mockResolvedValue(students);

      const result = await controller.findAll(paginationDto);

      expect(mockStudentsService.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(students);
    });

    it('should use default pagination values if none provided', async () => {
      const students = [
        { id: 'student-1', name: 'Student 1' },
        { id: 'student-2', name: 'Student 2' },
      ];
      
      mockStudentsService.findAll.mockResolvedValue(students);

      const result = await controller.findAll({});

      expect(mockStudentsService.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(students);
    });
  });

  describe('findOne', () => {
    it('should return a student by id', async () => {
      const student = { 
        id: 'student-id', 
        name: 'Test Student',
        age: 20,
        email: 'test@example.com',
        subjects: ['Math'],
        gender: 'Male',
        nickname: 'test_student20'
      };
      
      mockStudentsService.findOne.mockResolvedValue(student);

      const result = await controller.findOne('student-id');

      expect(mockStudentsService.findOne).toHaveBeenCalledWith('student-id');
      expect(result).toEqual(student);
    });

    it('should return a student by name or nickname', async () => {
      const student = { 
        id: 'student-id', 
        name: 'Test Student',
        age: 20,
        email: 'test@example.com',
        subjects: ['Math'],
        gender: 'Male',
        nickname: 'test_student20'
      };
      
      mockStudentsService.findOne.mockResolvedValue(student);

      const result = await controller.findOne('Test Student');

      expect(mockStudentsService.findOne).toHaveBeenCalledWith('Test Student');
      expect(result).toEqual(student);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const dto: UpdateStudentDto = {
        name: 'Updated Student',
        age: 21,
      };
      
      const updatedStudent = {
        id: 'student-id',
        name: 'Updated Student',
        age: 21,
        email: 'test@example.com',
        subjects: ['Math'],
        gender: 'Male',
        nickname: 'updated_student21'
      };
      
      mockStudentsService.update.mockResolvedValue(updatedStudent);

      const result = await controller.update('student-id', dto);

      expect(mockStudentsService.update).toHaveBeenCalledWith('student-id', dto);
      expect(result).toEqual(updatedStudent);
    });
  });

  describe('remove', () => {
    it('should remove a student', async () => {
      mockStudentsService.remove.mockResolvedValue(undefined);

      await controller.remove('student-id');

      expect(mockStudentsService.remove).toHaveBeenCalledWith('student-id');
    });
  });
});