import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TestAppModule } from './test-app.module';
import { DataSource } from 'typeorm';

jest.setTimeout(30000); // 30 segundos

describe('Database Connection Test (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should connect to the database', async () => {
    expect(dataSource.isInitialized).toBeTruthy();
    console.log("Database connection successful!");
  });
});