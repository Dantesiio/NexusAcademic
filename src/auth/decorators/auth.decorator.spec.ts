import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ValidRoles } from "../enums/valid-roles.enum";
import { UserRoleGuard } from "../guards/user-role/user-role.guard";
import { Auth } from "./auth.decorator";
import { RoleProtected } from "./role-protected/role-protected.decorator";

jest.mock('@nestjs/common', () => ({
    applyDecorators: jest.fn(),
    UseGuards: jest.fn(),
  }));
  
  jest.mock('@nestjs/passport', () => ({
    AuthGuard: jest.fn(() => 'MockAuthGuard'),
  }));
  
  jest.mock('../guards/user-role/user-role.guard', () => ({
    UserRoleGuard: jest.fn(() => 'UserRoleGuard'),
  }));
  
  jest.mock('./role-protected/role-protected.decorator', () => ({
    RoleProtected: jest.fn(() => 'RoleProtected'),
  }));
  
  describe('Auth Decorator', () => {
    it('should call applyDecorators with RoleProtected and UseGuards', () => {
      const roles: ValidRoles[] = [ValidRoles.admin, ValidRoles.teacher];
  
      Auth(...roles);
  
      expect(applyDecorators).toHaveBeenCalledWith(
        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRoleGuard),
      );
    });
  });