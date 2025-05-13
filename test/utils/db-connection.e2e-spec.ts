import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from "../../src/app.module";
import { DataSource } from 'typeorm';

jest.setTimeout(30000); // 30 segundos

describe('Database Connection Test (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      dataSource = moduleFixture.get<DataSource>(DataSource);
      await app.init();
      
      console.log("App initialized successfully");
    } catch (error) {
      console.error("Error during setup:", error);
      throw error;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('should connect to the database', async () => {
    try {
      // Verificar la conexión a la base de datos
      expect(dataSource.isInitialized).toBeTruthy();
      
      // Verificar que podemos ejecutar una consulta básica
      const result = await dataSource.query('SELECT 1 as value');
      expect(result[0].value).toBe(1);
      
      console.log("Database connection successful!");
    } catch (error) {
      console.error("Database connection error:", error);
      throw error;
    }
  });
});