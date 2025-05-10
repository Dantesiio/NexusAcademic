import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from '../controller/courses.controller';
import { CoursesService } from '../service/courses.service';
import { CreateCourseDto } from '../../courses/dto/create-course.dto';
import { UpdateCourseDto } from '../../courses/dto/update-course.dto';
import { CourseStatus } from '../../courses/enums/course-status.enum';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  const mockCoursesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new course', async () => {
      const dto: CreateCourseDto = {
        name: 'NestJS Course',
        description: 'Learn NestJS',
        code: 'NEST-101',
        teacherId: 'teacher-id',
        startDate: '2025-06-01',
        endDate: '2025-07-30',
        status: CourseStatus.ACTIVE,
      };
      
      const course = {
        id: 'course-id',
        name: 'NestJS Course',
        description: 'Learn NestJS',
        code: 'NEST-101',
        teacher: { id: 'teacher-id', name: 'Teacher Name' },
        status: CourseStatus.ACTIVE,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-07-30'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockCoursesService.create.mockResolvedValue(course);

      const result = await controller.create(dto);

      expect(mockCoursesService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(course);
    });
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const courses = [
        { id: 'course-1', name: 'Course 1' },
        { id: 'course-2', name: 'Course 2' },
      ];
      
      mockCoursesService.findAll.mockResolvedValue(courses);

      const result = await controller.findAll();

      expect(mockCoursesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(courses);
    });
  });

  describe('findOne', () => {
    it('should return a course by id', async () => {
      const course = { 
        id: 'course-id', 
        name: 'NestJS Course',
        description: 'Learn NestJS',
        code: 'NEST-101',
        teacher: { id: 'teacher-id', name: 'Teacher Name' },
        status: CourseStatus.ACTIVE,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-07-30'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockCoursesService.findOne.mockResolvedValue(course);

      const result = await controller.findOne('course-id');

      expect(mockCoursesService.findOne).toHaveBeenCalledWith('course-id');
      expect(result).toEqual(course);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const dto: UpdateCourseDto = {
        name: 'Updated Course',
        description: 'Updated Description',
      };
      
      const updatedCourse = {
        id: 'course-id',
        name: 'Updated Course',
        description: 'Updated Description',
        code: 'NEST-101',
        teacher: { id: 'teacher-id', name: 'Teacher Name' },
        status: CourseStatus.ACTIVE,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-07-30'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockCoursesService.update.mockResolvedValue(updatedCourse);

      const result = await controller.update('course-id', dto);

      expect(mockCoursesService.update).toHaveBeenCalledWith('course-id', dto);
      expect(result).toEqual(updatedCourse);
    });
  });

  describe('remove', () => {
    it('should remove a course', async () => {
      mockCoursesService.remove.mockResolvedValue(undefined);

      await controller.remove('course-id');

      expect(mockCoursesService.remove).toHaveBeenCalledWith('course-id');
    });
  });
});