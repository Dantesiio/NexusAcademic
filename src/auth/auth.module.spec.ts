import { Test } from '@nestjs/testing';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import { AuthController } from '../../src/auth/auth.controller';
import { JwtStrategy } from '../../src/auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/auth/entities/user.entity';
import { ConfigService } from '@nestjs/config';

// Mock del ConfigService para evitar cargar variables de entorno reales
const mockConfigService = {
  get: jest.fn((key) => {
    if (key === 'JWT_SECRET') return 'test-secret';
    return null;
  }),
};

// Mock del repositorio de usuarios
const mockUsersRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('AuthModule', () => {
  let module;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    })
    // Override del módulo TypeORM para evitar conexión real
    .overrideProvider(getRepositoryToken(User))
    .useValue(mockUsersRepository)
    // Override del ConfigService para evitar carga de .env
    .overrideProvider(ConfigService)
    .useValue(mockConfigService)
    .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have AuthService as provider', () => {
    const service = module.get(AuthService) as AuthService;
    expect(service).toBeDefined();
  });

  it('should have AuthController as controller', () => {
    const controller = module.get(AuthController) as AuthController;
    expect(controller).toBeDefined();
  });

  it('should have JwtStrategy as provider', () => {
    const strategy = module.get(JwtStrategy) as JwtStrategy;
    expect(strategy).toBeDefined();
  });

  it('should have JwtModule as module', () => {
    const jwtModule = module.get(JwtModule);
    expect(jwtModule).toBeDefined();
  });
});