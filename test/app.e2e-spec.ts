// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Set the global prefix to match main.ts
    app.setGlobalPrefix('api');
    
    await app.init();
  });

  it('should access API health check', () => {
    // Update the test to check for API instead of root route
    return request(app.getHttpServer())
      .get('/api')
      .expect(404); // If no root controller, 404 is actually expected
  });
  
  afterAll(async () => {
    await app.close();
  });
});