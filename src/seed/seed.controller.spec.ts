import { Test, TestingModule } from '@nestjs/testing';
import { SeedController } from '../seed/seed.controller';
import { SeedService } from '../seed/seed.service';

describe('SeedController', () => {
  let controller: SeedController;
  let service: SeedService;

  const mockSeedService = {
    runSeed: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedController],
      providers: [
        {
          provide: SeedService,
          useValue: mockSeedService
        }
      ]
    }).compile();

    controller = module.get<SeedController>(SeedController);
    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('executeSeed', () => {
    it('should call seedService.runSeed and return its result', async () => {
      mockSeedService.runSeed.mockResolvedValue('SEED EXECUTED');
      
      const result = await controller.executeSeed();
      
      expect(mockSeedService.runSeed).toHaveBeenCalled();
      expect(result).toBe('SEED EXECUTED');
    });
  });
});