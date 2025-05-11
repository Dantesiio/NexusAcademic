import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from 'supertest';
import { AppModule } from "../../../src/app.module";
import { User } from "../../../src/auth/entities/user.entity";
import { Repository } from "typeorm";

const testingUser = {
    email: 'gus@mail.com',
    password: 'Abc123',
    fullName: 'Testing teacher',
  };
  
  const testingAdminUser = {
    email: 'testing.admin@google.com',
    password: 'abc123',
    fullName: 'Testing Admin',
  };
  
  describe('Auth - Login', () => {
    let app: INestApplication;
    let userRepository: Repository<User>;
  
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      app = moduleFixture.createNestApplication();
  
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
      );
  
      await app.init();
  
      userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  
      const responseUser = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testingUser);
  
      const responseAdmin = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testingAdminUser);
  
      await userRepository.update(
        { email: testingAdminUser.email },
        { roles: ['admin'] },
      );
    });
  
    afterAll(async () => {
      await app.close();
    });
  
    it('/auth/login (POST) - should throw 400 if no body', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login');
  
      const errorMessages = [
        'email must be an email',
        'email must be a string',
        'password must be shorter than or equal to 50 characters',
        'password must be longer than or equal to 6 characters',
        'password must be a string',
      ];
  
      expect(response.status).toBe(400);
  
      errorMessages.forEach((message) => {
        expect(response.body.message).toContain(message);
      });
    });
  
    it('/auth/login (POST) - wrong credentials - email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'testingUser.email@google.com',
          password: testingUser.password,
        });
  
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: `User with email testingUser.email@google.com not found`,
        error: 'Unauthorized',
        statusCode: 401,
      });
    });
  
    it('/auth/login (POST) - wrong credentials - password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testingUser.email, password: 'abc1236788' });
  
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: `Email or password incorrect`,
        error: 'Unauthorized',
        statusCode: 401,
      });
    });
  
    it('/auth/login (POST) - valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testingUser.email, password: testingUser.password });
  
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        user: {
          id: expect.any(String),
          email: 'gus@mail.com',
        },
        token: expect.any(String),
      });
    });
  });