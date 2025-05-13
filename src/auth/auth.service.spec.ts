import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { LoginUserDto } from '../auth/dto/Login-user.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createAuthDto: CreateAuthDto = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
    };

    const user = {
      id: 'user-id',
      email: 'test@example.com',
      fullName: 'Test User',
      roles: ['teacher'],
      isActive: true,
    };

    it('should create a user successfully', async () => {
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashed-password' as never);
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.create(createAuthDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: createAuthDto.email,
        fullName: createAuthDto.fullName,
        password: 'hashed-password',
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: user.id });
      expect(result).toEqual({
        ...user,
        token: 'test-token',
      });
    });

    it('should throw BadRequestException on duplicate email', async () => {
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockRejectedValue({ code: '23505', detail: 'Key (email)=(test@example.com) already exists' });

      await expect(service.create(createAuthDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException on unexpected errors', async () => {
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockRejectedValue(new Error('Something went wrong'));

      await expect(service.create(createAuthDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('login', () => {
    const loginUserDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login a user successfully', async () => {
      const user = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true as never);

      const result = await service.login(loginUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginUserDto.email },
        select: { email: true, password: true, id: true },
      });
      expect(bcrypt.compareSync).toHaveBeenCalledWith(loginUserDto.password, user.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: user.id });
      expect(result).toEqual({
        ...user,
        token: 'test-token',
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginUserDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if password is incorrect', async () => {
      const user = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false as never);

      await expect(service.login(loginUserDto)).rejects.toThrow(NotFoundException);
    });
  });
});