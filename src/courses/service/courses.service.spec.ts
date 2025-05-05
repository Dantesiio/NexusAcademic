import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from '../../../src/courses/service/courses.service';
import { Course } from '../../../src/courses/entities/course.entity';
import { User } from '../../../src/auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CourseStatus } from '../enums/course-status.enum';

describe('CoursesService', () => {
  let service: CoursesService;
  let courseRepository: Repository<Course>;
  let userRepository: Repository<User>;

  const mockCourseRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    courseRepository = module.get<Repository<Course>>(getRepositoryToken(Course));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCourseDto: CreateCourseDto = {
      name: 'NestJS Course',
      description: 'Learn NestJS',
      code: 'NEST-101',
      teacherId: 'teacher-id',
      startDate: '2025-06-01',
      endDate: '2025-07-30',
      status: CourseStatus.ACTIVE,
    };

    const teacher = {
      id: 'teacher-id',
      email: 'teacher@example.com',
      fullName: 'Teacher Name',
      roles: ['teacher'],
      isActive: true,
    };

    const course = {
      id: 'course-id',
      name: 'NestJS Course',
      description: 'Learn NestJS',
      code: 'NEST-101',
      teacher,
      status: CourseStatus.ACTIVE,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-07-30'),
    };

    it('should create a course successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(teacher);
      mockCourseRepository.create.mockReturnValue(course);
      mockCourseRepository.save.mockResolvedValue(course);

      const result = await service.create(createCourseDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: createCourseDto.teacherId }
      });
      expect(mockCourseRepository.create).toHaveBeenCalledWith({
        ...createCourseDto,
        startDate: new Date(createCourseDto.startDate),
        endDate: new Date(createCourseDto.endDate),
        teacher,
      });
      expect(mockCourseRepository.save).toHaveBeenCalledWith(course);
      expect(result).toEqual(course);
    });

    it('should throw NotFoundException if teacher not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createCourseDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if endDate is before startDate', async () => {
      const invalidDto = {
        ...createCourseDto,
        startDate: '2025-08-01',
        endDate: '2025-07-01',
      };

      mockUserRepository.findOne.mockResolvedValue(teacher);

      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const courses = [
        { id: 'course-1', name: 'Course 1' },
        { id: 'course-2', name: 'Course 2' },
      ];
      mockCourseRepository.find.mockResolvedValue(courses);

      const result = await service.findAll();

      expect(mockCourseRepository.find).toHaveBeenCalled();
      expect(result).toEqual(courses);
    });
  });

  describe('findOne', () => {
    it('should return a course by id', async () => {
      const course = { id: 'course-id', name: 'Test Course' };
      mockCourseRepository.findOne.mockResolvedValue(course);

      const result = await service.findOne('course-id');

      expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'course-id' },
      });
      expect(result).toEqual(course);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockCourseRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateCourseDto: UpdateCourseDto = {
      name: 'Updated Course',
      description: 'Updated Description',
    };

    const course = {
      id: 'course-id',
      name: 'Original Course',
      description: 'Original Description',
      teacher: { id: 'teacher-id' },
    };

    it('should update a course successfully', async () => {
      mockCourseRepository.findOne.mockResolvedValue(course);
      mockCourseRepository.save.mockResolvedValue({
        ...course,
        ...updateCourseDto,
      });

      const result = await service.update('course-id', updateCourseDto);

      expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'course-id' },
      });
      expect(mockCourseRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        ...course,
        ...updateCourseDto,
      });
    });

    it('should update teacher if teacherId is provided', async () => {
      const newTeacher = { id: 'new-teacher-id', name: 'New Teacher' };
      const updateWithTeacherDto = {
        ...updateCourseDto,
        teacherId: 'new-teacher-id',
      };

      mockCourseRepository.findOne.mockResolvedValue(course);
      mockUserRepository.findOne.mockResolvedValue(newTeacher);
      mockCourseRepository.save.mockResolvedValue({
        ...course,
        ...updateCourseDto,
        teacher: newTeacher,
      });

      const result = await service.update('course-id', updateWithTeacherDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'new-teacher-id' },
      });
      expect(result.teacher).toEqual(newTeacher);
    });

    it('should throw NotFoundException if teacher not found during update', async () => {
      const updateWithTeacherDto = {
        ...updateCourseDto,
        teacherId: 'non-existent-teacher',
      };

      mockCourseRepository.findOne.mockResolvedValue(course);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.update('course-id', updateWithTeacherDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a course successfully', async () => {
      const course = { id: 'course-id', name: 'Course to Remove' };
      mockCourseRepository.findOne.mockResolvedValue(course);
      mockCourseRepository.remove.mockResolvedValue(undefined);

      await service.remove('course-id');

      expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'course-id' },
      });
      expect(mockCourseRepository.remove).toHaveBeenCalledWith(course);
    });

    it('should throw NotFoundException if course to remove is not found', async () => {
      mockCourseRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});