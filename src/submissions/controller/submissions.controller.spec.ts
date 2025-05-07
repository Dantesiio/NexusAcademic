import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsController } from '../../../src/submissions/controller/submissions.controller';
import { SubmissionsService } from '../../../src/submissions/service/submissions.service';
import { CreateSubmissionDto } from '../../../src/submissions/dto/create-submission.dto';
import { GradeSubmissionDto } from '../../../src/submissions/dto/grade-submission.dto';

describe('SubmissionsController', () => {
  let controller: SubmissionsController;
  let service: SubmissionsService;

  const mockSubmissionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    grade: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionsController],
      providers: [
        {
          provide: SubmissionsService,
          useValue: mockSubmissionsService,
        },
      ],
    }).compile();

    controller = module.get<SubmissionsController>(SubmissionsController);
    service = module.get<SubmissionsService>(SubmissionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new submission', async () => {
      const dto: CreateSubmissionDto = {
        courseId: 'course-id',
        studentId: 'student-id',
        fileUrl: 'https://example.com/file.pdf',
        comments: 'Test submission',
      };
      
      const submission = {
        id: 'submission-id',
        ...dto,
      };
      
      mockSubmissionsService.create.mockResolvedValue(submission);

      const result = await controller.create(dto);

      expect(mockSubmissionsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(submission);
    });
  });

  describe('findAll', () => {
    it('should return all submissions', async () => {
      const submissions = [
        { id: 'submission-1', fileUrl: 'url-1' },
        { id: 'submission-2', fileUrl: 'url-2' },
      ];
      
      mockSubmissionsService.findAll.mockResolvedValue(submissions);

      const result = await controller.findAll();

      expect(mockSubmissionsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(submissions);
    });
  });

  describe('findOne', () => {
    it('should return a submission by id', async () => {
      const submission = { id: 'submission-id', fileUrl: 'test-url' };
      
      mockSubmissionsService.findOne.mockResolvedValue(submission);

      const result = await controller.findOne('submission-id');

      expect(mockSubmissionsService.findOne).toHaveBeenCalledWith('submission-id');
      expect(result).toEqual(submission);
    });
  });

  describe('grade', () => {
    it('should grade a submission', async () => {
      const dto: GradeSubmissionDto = {
        grade: 4.5,
        comments: 'Good work',
      };
      
      const gradedSubmission = {
        id: 'submission-id',
        fileUrl: 'test-url',
        grade: dto.grade,
        comments: dto.comments,
      };
      
      mockSubmissionsService.grade.mockResolvedValue(gradedSubmission);

      const result = await controller.grade('submission-id', dto);

      expect(mockSubmissionsService.grade).toHaveBeenCalledWith('submission-id', dto);
      expect(result).toEqual(gradedSubmission);
    });
  });

  describe('remove', () => {
    it('should remove a submission', async () => {
      const removeResult = { affected: 1 };
      
      mockSubmissionsService.remove.mockResolvedValue(removeResult);

      const result = await controller.remove('submission-id');

      expect(mockSubmissionsService.remove).toHaveBeenCalledWith('submission-id');
      expect(result).toEqual(removeResult);
    });
  });
});