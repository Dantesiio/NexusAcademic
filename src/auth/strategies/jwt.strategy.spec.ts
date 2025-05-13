import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { User } from 'src/auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userRepository: Repository<User>;
  let configService: ConfigService;

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if valid JWT payload and user exists', async () => {
      const user = {
        id: 'user-id',
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'hashedPassword',
        isActive: true,
        roles: ['teacher'],
      };

      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await strategy.validate({ id: 'user-id' });

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 'user-id' });
      expect(result).toEqual({ ...user, password: undefined });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(strategy.validate({ id: 'non-existent-id' })).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 'non-existent-id' });
    });

    it('should throw UnauthorizedException if user is not active', async () => {
      const inactiveUser = {
        id: 'user-id',
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'hashedPassword',
        isActive: false,
        roles: ['teacher'],
      };

      mockUserRepository.findOneBy.mockResolvedValue(inactiveUser);

      await expect(strategy.validate({ id: 'user-id' })).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 'user-id' });
    });

    it('should remove password from returned user', async () => {
      const user = {
        id: 'user-id',
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'hashedPassword',
        isActive: true,
        roles: ['teacher'],
      };

      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await strategy.validate({ id: 'user-id' });

      expect(result.password).toBeUndefined();
    });
  });
});