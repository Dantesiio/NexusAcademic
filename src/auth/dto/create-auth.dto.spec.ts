import { validate } from 'class-validator';
import { CreateAuthDto } from '../dto/create-auth.dto';

describe('CreateUserDTO', () => {
  it('should validate a correct DTO', async () => {
    const dto = new CreateAuthDto();
    dto.email = 'test@example.com';
    dto.password = 'Password123';
    dto.fullName = 'Test User';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should throw errors if email is not valid', async () => {
    const dto = new CreateAuthDto();
    dto.email = 'invalid-email';
    dto.password = 'Password123';
    dto.fullName = 'Test User';

    const errors = await validate(dto);
    
    expect(errors.length).toBeGreaterThan(0);
    const emailError = errors.find((error) => error.property === 'email');
    expect(emailError).toBeDefined();
    expect(emailError?.constraints).toBeDefined();
  });

  it('should throw errors if password is not valid', async () => {
    const dto = new CreateAuthDto();
    dto.email = 'test@example.com';
    dto.password = 'short'; // Contraseña muy corta
    dto.fullName = 'Test User';

    const errors = await validate(dto);
    
    expect(errors.length).toBeGreaterThan(0);
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError?.constraints).toBeDefined();
    // No verificamos el mensaje exacto ya que depende de la implementación en tu DTO
  });

  it('should throw errors if fullName is not provided', async () => {
    const dto = new CreateAuthDto();
    dto.email = 'test@example.com';
    dto.password = 'Password123';
    // Omitimos fullName

    const errors = await validate(dto);
    
    expect(errors.length).toBeGreaterThan(0);
    const nameError = errors.find((error) => error.property === 'fullName');
    expect(nameError).toBeDefined();
    expect(nameError?.constraints).toBeDefined();
  });
});