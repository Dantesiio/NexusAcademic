// src/commons/dto/pagination.dto.spec.ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

describe('PaginationDto', () => {
  it('should validate a correct DTO', async () => {
    const dto = plainToInstance(PaginationDto, {
      limit: 10,
      offset: 0
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate when no values are provided', async () => {
    const dto = plainToInstance(PaginationDto, {});

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should transform string values to numbers', async () => {
    const dto = plainToInstance(PaginationDto, {
      limit: '10',
      offset: '5'
    });

    expect(typeof dto.limit).toBe('number');
    expect(typeof dto.offset).toBe('number');
    expect(dto.limit).toBe(10);
    expect(dto.offset).toBe(5);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should throw errors if limit is negative', async () => {
    const dto = plainToInstance(PaginationDto, {
      limit: -10,
      offset: 0
    });

    const errors = await validate(dto);
    
    expect(errors.length).toBeGreaterThan(0);
    const limitError = errors.find((error) => error.property === 'limit');
    expect(limitError).toBeDefined();
  });

  it('should throw errors if offset is negative', async () => {
    const dto = plainToInstance(PaginationDto, {
      limit: 10,
      offset: -5
    });

    const errors = await validate(dto);
    
    expect(errors.length).toBeGreaterThan(0);
    const offsetError = errors.find((error) => error.property === 'offset');
    expect(offsetError).toBeDefined();
  });
});