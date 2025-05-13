import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userRepository: Repository<User>;
  let configService: ConfigService;
  let authService: AuthService;

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  const mockAuthService = {
    isTokenBlacklisted: jest.fn().mockReturnValue(false),
  };

  // Mock request object with authorization header
  const mockRequest = {
    headers: {
      authorization: 'Bearer test-token',
    },
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
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
    authService = module.get<AuthService>(AuthService);
    
    // Reset the mock before each test to ensure consistent behavior
    mockAuthService.isTokenBlacklisted.mockClear();
    mockAuthService.isTokenBlacklisted.mockReturnValue(false);
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

      const result = await strategy.validate(mockRequest, { id: 'user-id' });

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 'user-id' });
      expect(authService.isTokenBlacklisted).toHaveBeenCalledWith('test-token');
      expect(result).toEqual({ ...user, password: undefined });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(strategy.validate(mockRequest, { id: 'non-existent-id' })).rejects.toThrow(
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

      await expect(strategy.validate(mockRequest, { id: 'user-id' })).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 'user-id' });
    });

    it('should throw UnauthorizedException if token is blacklisted', async () => {
      const user = {
        id: 'user-id',
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'hashedPassword',
        isActive: true,
        roles: ['teacher'],
      };

      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockAuthService.isTokenBlacklisted.mockReturnValue(true); // Set to true for this test only

      await expect(strategy.validate(mockRequest, { id: 'user-id' })).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 'user-id' });
      expect(authService.isTokenBlacklisted).toHaveBeenCalledWith('test-token');
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
      // Explicitly set this to false for this test
      mockAuthService.isTokenBlacklisted.mockReturnValue(false);

      const result = await strategy.validate(mockRequest, { id: 'user-id' });

      expect(result.password).toBeUndefined();
      expect(authService.isTokenBlacklisted).toHaveBeenCalledWith('test-token');
      expect(authService.isTokenBlacklisted).toHaveReturnedWith(false);
    });

    it('should handle requests without authorization header', async () => {
      const user = {
        id: 'user-id',
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'hashedPassword',
        isActive: true,
        roles: ['teacher'],
      };

      const requestWithoutAuth = { headers: {} };
      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await strategy.validate(requestWithoutAuth, { id: 'user-id' });

      expect(result).toEqual({ ...user, password: undefined });
      // Should not try to check blacklist for undefined token
      expect(authService.isTokenBlacklisted).not.toHaveBeenCalled();
    });
  });
});