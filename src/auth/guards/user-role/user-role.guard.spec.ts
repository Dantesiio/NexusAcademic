import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleGuard } from 'src/auth/guards/user-role/user-role.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, BadRequestException, ForbiddenException } from '@nestjs/common';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

describe('UserRoleGuard', () => {
  let guard: UserRoleGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRoleGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<UserRoleGuard>(UserRoleGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockExecutionContext: ExecutionContext;

    beforeEach(() => {
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: {
              email: 'test@example.com',
              roles: ['teacher'],
            },
          }),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;
    });

    it('should return true if no valid roles are specified', () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);

      const result = guard.canActivate(mockExecutionContext);

      expect(reflector.get).toHaveBeenCalledWith(META_ROLES, mockExecutionContext.getHandler());
      expect(result).toBe(true);
    });

    it('should return true if an empty array of valid roles is specified', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([]);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw BadRequestException if user is not in the request', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([ValidRoles.admin]);
      mockExecutionContext.switchToHttp().getRequest = jest.fn().mockReturnValue({});

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(BadRequestException);
    });

    it('should return true if user has required role', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([ValidRoles.teacher]);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException if user does not have required role', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([ValidRoles.admin]);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(ForbiddenException);
    });

    it('should return true if user has at least one of the required roles', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([ValidRoles.admin, ValidRoles.teacher]);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException with proper message when user lacks required roles', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([ValidRoles.admin, ValidRoles.superUser]);

      try {
        guard.canActivate(mockExecutionContext);
        fail('Expected ForbiddenException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toContain('User test@example.com needs a valid role');
      }
    });
  });
});