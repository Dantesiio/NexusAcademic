import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from 'supertest';
import { AppModule } from "../../../src/app.module";
import { User } from "../../../src/auth/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

describe('Auth - Login', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  
  const testUser = {
    email: 'test@example.com',
    password: 'Password123',
    fullName: 'Test User',
  };
  
  const hashedPassword = bcrypt.hashSync(testUser.password, 10);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Important: Set the global prefix as in main.ts
    app.setGlobalPrefix('api');
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    userRepository = app.get<Repository<User>>(getRepositoryToken(User));

    // Clean up any existing test user
    await userRepository.delete({ email: testUser.email });
    
    // Create a test user with the hashed password
    await userRepository.save({
      email: testUser.email,
      password: hashedPassword,
      fullName: testUser.fullName,
      isActive: true,
      roles: ['teacher'],
    });
  });

  afterAll(async () => {
    await userRepository.delete({ email: testUser.email });
    await app.close();
  });

  it('/api/auth/login (POST) - should throw 400 if no body', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login'); // Note the /api prefix
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('email must be an email');
  });

  it('/api/auth/login (POST) - wrong credentials - email', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: testUser.password,
      });

    expect(response.status).toBe(404); // Note: Your service returns 404 for wrong email, not 401
    expect(response.body.message).toContain('not found');
  });

  it('/api/auth/login (POST) - wrong credentials - password', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ 
        email: testUser.email, 
        password: 'WrongPassword123' 
      });

    expect(response.status).toBe(404); // Note: Your service returns 404 for wrong password, not 401
    expect(response.body.message).toContain('Email or password incorrect');
  });

  it('/api/auth/login (POST) - valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ 
        email: testUser.email, 
        password: testUser.password 
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.email).toBe(testUser.email);
  });
});