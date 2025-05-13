import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from 'src/seed/seed.service';
import { StudentsService } from 'src/students/students.service';
import { initialData } from 'src/seed/data/seed-data';

describe('SeedService', () => {
  let service: SeedService;
  let studentsService: StudentsService;

  const mockStudentsService = {
    deleteAllStudents: jest.fn(),
    create: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: StudentsService,
          useValue: mockStudentsService
        }
      ]
    }).compile();

    service = module.get<SeedService>(SeedService);
    studentsService = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('runSeed', () => {
    it('should call insertNewStudents and return success message', async () => {
      // Mock el método insertNewStudents
      jest.spyOn(service, 'insertNewStudents').mockResolvedValue(true);
      
      const result = await service.runSeed();
      
      expect(service.insertNewStudents).toHaveBeenCalled();
      expect(result).toBe('SEED EXECUTED');
    });
  });

  describe('insertNewStudents', () => {
    it('should delete all students and insert seed data', async () => {
      mockStudentsService.deleteAllStudents.mockResolvedValue(true);
      mockStudentsService.create.mockResolvedValue({ id: 'test-id' });
      
      const result = await service.insertNewStudents();
      
      expect(mockStudentsService.deleteAllStudents).toHaveBeenCalled();
      expect(mockStudentsService.create).toHaveBeenCalledTimes(initialData.students.length);
      expect(result).toBe(true);
    });
  });
});