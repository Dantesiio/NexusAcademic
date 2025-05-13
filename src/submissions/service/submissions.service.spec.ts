import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsService } from '../service/submissions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { CreateSubmissionDto } from '../dto/create-submission.dto';
import { GradeSubmissionDto } from '../dto/grade-submission.dto';
import { CoursesService } from '../../courses/service/courses.service';
import { StudentsService } from '../../students/students.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CourseStatus } from '../../courses/enums/course-status.enum';

describe('SubmissionsService', () => {
  let service: SubmissionsService;
  let submissionRepository: Repository<Submission>;
  let coursesService: CoursesService;
  let studentsService: StudentsService;

  // Objetos mock completos para pasar las verificaciones de tipos
  const mockTeacher = {
    id: 'teacher-id',
    email: 'teacher@example.com',
    fullName: 'Test Teacher',
    isActive: true,
    roles: ['teacher']
  };

  const mockCourse = {
    id: 'course-id',
    name: 'Test Course',
    description: 'Test course description',
    code: 'TEST-101',
    teacher: mockTeacher,
    status: CourseStatus.ACTIVE,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-06-30'),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockStudent = {
    id: 'student-id',
    name: 'Test Student',
    age: 20,
    email: 'student@example.com',
    subjects: ['Math', 'Science'],
    gender: 'Male',
    nickname: 'test_student20'
  };

  const mockSubmissionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockCoursesService = {
    findOne: jest.fn(),
  };

  const mockStudentsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    submissionRepository = module.get<Repository<Submission>>(getRepositoryToken(Submission));
    coursesService = module.get<CoursesService>(CoursesService);
    studentsService = module.get<StudentsService>(StudentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createSubmissionDto: CreateSubmissionDto = {
      courseId: 'course-id',
      studentId: 'student-id',
      fileUrl: 'https://example.com/submission.pdf',
      comments: 'Initial submission',
    };
    
    const mockSubmission = {
      id: 'submission-id',
      course: mockCourse,
      student: mockStudent,
      fileUrl: 'https://example.com/submission.pdf',
      comments: 'Initial submission',
      grade: null,
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should create a submission successfully', async () => {
      mockCoursesService.findOne.mockResolvedValue(mockCourse);
      mockStudentsService.findOne.mockResolvedValue(mockStudent);
      mockSubmissionRepository.findOne.mockResolvedValue(null);
      mockSubmissionRepository.create.mockReturnValue(mockSubmission);
      mockSubmissionRepository.save.mockResolvedValue(mockSubmission);

      const result = await service.create(createSubmissionDto);

      expect(mockCoursesService.findOne).toHaveBeenCalledWith(createSubmissionDto.courseId);
      expect(mockStudentsService.findOne).toHaveBeenCalledWith(createSubmissionDto.studentId);
      expect(mockSubmissionRepository.findOne).toHaveBeenCalledWith({
        where: {
          course: { id: createSubmissionDto.courseId },
          student: { id: createSubmissionDto.studentId },
        }
      });
      expect(mockSubmissionRepository.create).toHaveBeenCalledWith({
        ...createSubmissionDto,
        course: mockCourse,
        student: mockStudent,
      });
      expect(mockSubmissionRepository.save).toHaveBeenCalledWith(mockSubmission);
      expect(result).toEqual(mockSubmission);
    });

    it('should throw BadRequestException if submission already exists', async () => {
      mockCoursesService.findOne.mockResolvedValue(mockCourse);
      mockStudentsService.findOne.mockResolvedValue(mockStudent);
      mockSubmissionRepository.findOne.mockResolvedValue(mockSubmission);

      await expect(service.create(createSubmissionDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of submissions', async () => {
      const mockSubmissions = [
        { 
          id: 'submission-1', 
          fileUrl: 'url-1', 
          course: mockCourse, 
          student: mockStudent,
          comments: '',
          grade: null,
          submittedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          id: 'submission-2', 
          fileUrl: 'url-2',
          course: mockCourse, 
          student: mockStudent,
          comments: '',
          grade: null,
          submittedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];
      mockSubmissionRepository.find.mockResolvedValue(mockSubmissions);

      const result = await service.findAll();

      expect(mockSubmissionRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockSubmissions);
    });
  });

  describe('findOne', () => {
    it('should return a submission by id', async () => {
      const mockSubmission = { 
        id: 'submission-id', 
        fileUrl: 'test-url',
        course: mockCourse, 
        student: mockStudent,
        comments: '',
        grade: null,
        submittedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockSubmissionRepository.findOne.mockResolvedValue(mockSubmission);

      const result = await service.findOne('submission-id');

      expect(mockSubmissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'submission-id' },
      });
      expect(result).toEqual(mockSubmission);
    });

    it('should throw NotFoundException if submission not found', async () => {
      mockSubmissionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('grade', () => {
    const gradeSubmissionDto: GradeSubmissionDto = {
      grade: 4.5,
      comments: 'Good work',
    };

    it('should grade a submission successfully', async () => {
      const submission = {
        id: 'submission-id',
        fileUrl: 'test-url',
        grade: null,
        comments: 'Initial submission',
        course: mockCourse, 
        student: mockStudent,
        submittedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const gradedSubmission = {
        ...submission,
        grade: 4.5,
        comments: 'Good work',
      };

      // Usamos jest.spyOn para mockear el método findOne del servicio
      const findOneSpy = jest.spyOn(service, 'findOne').mockImplementation(() => {
        return Promise.resolve(submission as Submission);
      });
      
      mockSubmissionRepository.save.mockResolvedValue(gradedSubmission);

      const result = await service.grade('submission-id', gradeSubmissionDto);

      expect(findOneSpy).toHaveBeenCalledWith('submission-id');
      expect(mockSubmissionRepository.save).toHaveBeenCalledWith({
        ...submission,
        grade: gradeSubmissionDto.grade,
        comments: gradeSubmissionDto.comments,
      });
      expect(result).toEqual(gradedSubmission);
      
      // Restaurar el mock del método findOne
      findOneSpy.mockRestore();
    });

    it('should keep original comments if not provided in the dto', async () => {
      const submission = {
        id: 'submission-id',
        fileUrl: 'test-url',
        grade: null,
        comments: 'Initial submission',
        course: mockCourse, 
        student: mockStudent,
        submittedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const gradeOnlyDto: GradeSubmissionDto = {
        grade: 4.5,
      };

      const gradedSubmission = {
        ...submission,
        grade: 4.5,
      };

      // Usamos jest.spyOn para mockear el método findOne del servicio
      const findOneSpy = jest.spyOn(service, 'findOne').mockImplementation(() => {
        return Promise.resolve(submission as Submission);
      });
      
      mockSubmissionRepository.save.mockResolvedValue(gradedSubmission);

      await service.grade('submission-id', gradeOnlyDto);

      expect(mockSubmissionRepository.save).toHaveBeenCalledWith({
        ...submission,
        grade: gradeOnlyDto.grade,
        comments: submission.comments,
      });
      
      // Restaurar el mock del método findOne
      findOneSpy.mockRestore();
    });
  });

  describe('remove', () => {
    it('should remove a submission successfully', async () => {
      const submission = { 
        id: 'submission-id', 
        fileUrl: 'test-url',
        course: mockCourse, 
        student: mockStudent,
        comments: '',
        grade: null,
        submittedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Usamos jest.spyOn para mockear el método findOne del servicio
      const findOneSpy = jest.spyOn(service, 'findOne').mockImplementation(() => {
        return Promise.resolve(submission as Submission);
      });
      
      mockSubmissionRepository.remove.mockResolvedValue(undefined);

      await service.remove('submission-id');

      expect(findOneSpy).toHaveBeenCalledWith('submission-id');
      expect(mockSubmissionRepository.remove).toHaveBeenCalledWith(submission);
      
      // Restaurar el mock del método findOne
      findOneSpy.mockRestore();
    });
  });
});