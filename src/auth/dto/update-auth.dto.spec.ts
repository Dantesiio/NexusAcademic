// src/auth/dto/update-auth.dto.spec.ts
import { UpdateAuthDto } from './update-auth.dto';

describe('UpdateAuthDto', () => {
  it('should be defined', () => {
    const dto = new UpdateAuthDto();
    expect(dto).toBeDefined();
  });
});