// src/auth/dto/update-auth.dto.spec.ts
import { PartialType } from '@nestjs/mapped-types';
import { UpdateAuthDto } from './update-auth.dto';
import { CreateAuthDto } from './create-auth.dto';

// Mock para PartialType
jest.mock('@nestjs/mapped-types', () => ({
  PartialType: jest.fn(classRef => class extends classRef {})
}));

describe('UpdateAuthDto', () => {
  it('should call PartialType with CreateAuthDto', () => {
    // Verificar que PartialType fue llamado con CreateAuthDto
    expect(PartialType).toHaveBeenCalledWith(CreateAuthDto);
  });
  
  it('should be a class that extends CreateAuthDto', () => {
    // Instanciar UpdateAuthDto
    const dto = new UpdateAuthDto();
    
    // Verificar que es una instancia de PartialType(CreateAuthDto)
    expect(dto).toBeInstanceOf(CreateAuthDto);
  });
});