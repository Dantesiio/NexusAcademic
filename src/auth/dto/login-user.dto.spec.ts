import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { LoginUserDto } from "./Login-user.dto";

describe('LoginUserDTO', () => {
    it('should have the correct properties', async () => {
      const dto = plainToClass(LoginUserDto, {
        email: 'gus@mail.com',
        password: 'Abc123',
      });
  
      const errors = await validate(dto);
  
      expect(errors.length).toBe(0);
    });
  
    it('should throw errors if password is not valid', async () => {
      const dto = plainToClass(LoginUserDto, {
        email: 'gus@mail.com',
        password: 'abc13',
      });
  
      const errors = await validate(dto);
  
      const passwordError = errors.find((error) => error.property === 'password');
  
      expect(passwordError).toBeDefined();
      expect(passwordError?.constraints).toBeDefined();
    });
  });