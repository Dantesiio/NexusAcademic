// src/auth/decorators/raw-headers.decorator.spec.ts
import { RawHeaders } from './raw-headers.decorator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Mockear createParamDecorator para capturar la función factory
jest.mock('@nestjs/common', () => {
  const originalModule = jest.requireActual('@nestjs/common');
  let capturedFactory;
  
  return {
    ...originalModule,
    createParamDecorator: jest.fn((factory) => {
      capturedFactory = factory;
      // Devolver una función que permite acceder a la factory
      const decorator = () => {};
      decorator.factory = capturedFactory;
      return decorator;
    }),
    ExecutionContext: jest.fn()
  };
});

describe('RawHeaders Decorator', () => {
  let factory;
  
  beforeEach(() => {
    // Obtener la factory capturada
    factory = (RawHeaders as any).factory;
    jest.clearAllMocks();
  });

  it('should return raw headers from request', () => {
    // Mock del context y request
    const mockRawHeaders = ['Content-Type', 'application/json'];
    const mockRequest = { rawHeaders: mockRawHeaders };
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest)
      })
    };
    
    // Ejecutar la factory
    const result = factory(null, mockContext);
    
    // Verificar que devuelve los headers
    expect(mockContext.switchToHttp).toHaveBeenCalled();
    expect(mockContext.switchToHttp().getRequest).toHaveBeenCalled();
    expect(result).toEqual(mockRawHeaders);
  });
});