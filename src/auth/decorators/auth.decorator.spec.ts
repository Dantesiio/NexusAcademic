import { Auth } from '../../../src/auth/decorators/auth.decorator';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../../../src/auth/enums/valid-roles.enum';
import { RoleProtected } from '../../../src/auth/decorators/role-protected/role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../../../src/auth/guards/user-role/user-role.guard';

// Mock de los decoradores necesarios
jest.mock('@nestjs/common', () => ({
  applyDecorators: jest.fn(),
  UseGuards: jest.fn(),
}));

jest.mock('../../../src/auth/decorators/role-protected/role-protected.decorator', () => ({
  RoleProtected: jest.fn(),
}));

describe('Auth Decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should apply multiple decorators', () => {
    // Configurar mocks
    (RoleProtected as jest.Mock).mockReturnValue('roleProtectedDecorator');
    (UseGuards as jest.Mock).mockReturnValue('useGuardsDecorator');
    (applyDecorators as jest.Mock).mockReturnValue('combinedDecorator');

    // Ejecutar el decorador Auth
    const result = Auth(ValidRoles.admin, ValidRoles.teacher);

    // Verificar que se llama a RoleProtected con los roles correctos
    expect(RoleProtected).toHaveBeenCalledWith(ValidRoles.admin, ValidRoles.teacher);
    
    // Verificar que se llama a UseGuards con los guards correctos
    expect(UseGuards).toHaveBeenCalledWith(AuthGuard(), UserRoleGuard);
    
    // Verificar que se llama a applyDecorators con los decoradores creados
    expect(applyDecorators).toHaveBeenCalledWith(
      'roleProtectedDecorator',
      'useGuardsDecorator'
    );
    
    // Verificar que el resultado es el valor retornado por applyDecorators
    expect(result).toBe('combinedDecorator');
  });

  it('should work without roles', () => {
    (RoleProtected as jest.Mock).mockReturnValue('roleProtectedDecorator');
    (UseGuards as jest.Mock).mockReturnValue('useGuardsDecorator');
    (applyDecorators as jest.Mock).mockReturnValue('combinedDecorator');

    const result = Auth();

    expect(RoleProtected).toHaveBeenCalledWith();
    expect(UseGuards).toHaveBeenCalledWith(AuthGuard(), UserRoleGuard);
    expect(applyDecorators).toHaveBeenCalledWith(
      'roleProtectedDecorator',
      'useGuardsDecorator'
    );
    expect(result).toBe('combinedDecorator');
  });

  it('should apply different roles when passed', () => {
    (RoleProtected as jest.Mock).mockReturnValue('roleProtectedDecorator');
    (UseGuards as jest.Mock).mockReturnValue('useGuardsDecorator');
    (applyDecorators as jest.Mock).mockReturnValue('combinedDecorator');

    Auth(ValidRoles.superUser);

    expect(RoleProtected).toHaveBeenCalledWith(ValidRoles.superUser);
  });
});