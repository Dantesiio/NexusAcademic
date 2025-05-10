// src/auth/decorators/get-user.decorator.spec.ts
import { GetUser } from './get-user.decorator';
import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

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
    ExecutionContext: jest.fn(),
    InternalServerErrorException: jest.fn()
  };
});

describe('GetUser Decorator', () => {
  let factory;
  
  beforeEach(() => {
    // Obtener la factory capturada
    factory = (GetUser as any).factory;
    jest.clearAllMocks();
  });

  it('should return the user when present in request', () => {
    // Mock del context y request
    const mockRequest = { user: { id: 'user-id', email: 'test@example.com' } };
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest)
      })
    };
    
    // Ejecutar la factory con data=null
    const result = factory(null, mockContext);
    
    // Verificar que devuelve el usuario completo
    expect(mockContext.switchToHttp).toHaveBeenCalled();
    expect(mockContext.switchToHttp().getRequest).toHaveBeenCalled();
    expect(result).toEqual(mockRequest.user);
  });

  it('should return specific user property when data is provided', () => {
    // Mock del context y request
    const mockRequest = { user: { id: 'user-id', email: 'test@example.com' } };
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest)
      })
    };
    
    // Ejecutar la factory con data='email'
    const result = factory('email', mockContext);
    
    // Verificar que devuelve la propiedad específica
    expect(result).toBe('test@example.com');
  });
});