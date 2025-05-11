import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from 'supertest';
import { AppModule } from "../../../src/app.module";
import { Repository } from "typeorm";
import { Student } from "../../../src/students/entities/student.entity";
import { User } from "../../../src/auth/entities/user.entity";

// Aumentar el tiempo de espera para pruebas e2e
jest.setTimeout(30000);

describe('StudentsModule (e2e)', () => {
  let app: INestApplication;
  let studentRepository: Repository<Student>;
  let userRepository: Repository<User>;
  let adminToken: string;
  let teacherToken: string;

  const adminUser = {
    email: 'admin-students@test.com',
    password: 'Admin123',
    fullName: 'Admin User'
  };

  const teacherUser = {
    email: 'teacher-students@test.com',
    password: 'Teacher123',
    fullName: 'Teacher User'
  };

  const testStudent = {
    name: 'Test Student',
    age: 20,
    email: 'student@test.com',
    subjects: ['Math', 'Science'],
    gender: 'Male',
    grades: [
      { subject: 'Math', grade: 4.5 },
      { subject: 'Science', grade: 4.2 }
    ]
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Establecer el prefijo global (asegúrate de que coincida con tu configuración en main.ts)
    app.setGlobalPrefix('api');

    await app.init();

    studentRepository = app.get<Repository<Student>>(getRepositoryToken(Student));
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));

    // Crear usuario admin
    const adminResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(adminUser);
    
    // Actualizar a rol admin - corrección
    await userRepository.update(
      { email: adminUser.email }, 
      { roles: ['admin'] }
    );

    // Crear usuario teacher
    const teacherResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(teacherUser);

    // Login para obtener tokens
    const adminLoginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: adminUser.email, password: adminUser.password });
    
    adminToken = adminLoginResponse.body.token;

    const teacherLoginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: teacherUser.email, password: teacherUser.password });
    
    teacherToken = teacherLoginResponse.body.token;
  });

  afterAll(async () => {
    try {
      // Limpiar datos de prueba
      await studentRepository.delete({ email: testStudent.email });
      
      // Limpiar usuarios creados para las pruebas
      await userRepository.delete({ email: adminUser.email });
      await userRepository.delete({ email: teacherUser.email });
    } catch (error) {
      console.error('Error durante la limpieza:', error);
    } finally {
      await app.close();
    }
  });

  describe('POST /students', () => {
    it('should require authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/students')
        .send(testStudent);

      expect(response.status).toBe(401);
    });

    it('should require admin role', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/students')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(testStudent);

      expect(response.status).toBe(403);
    });

    it('should create a student with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testStudent);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: testStudent.name,
        age: testStudent.age,
        email: testStudent.email,
        subjects: testStudent.subjects,
        gender: testStudent.gender,
        nickname: expect.any(String),
        grades: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            subject: 'Math',
            grade: 4.5
          }),
          expect.objectContaining({
            id: expect.any(String),
            subject: 'Science',
            grade: 4.2
          })
        ])
      });
    });

    it('should validate student data', async () => {
      const invalidStudent = {
        name: 'Test Student',
        age: -1, // Invalid age
        email: 'invalid-email', // Invalid email
        subjects: 'not-an-array', // Should be array
        gender: 'InvalidGender', // Not in allowed values
      };

      const response = await request(app.getHttpServer())
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidStudent);

      expect(response.status).toBe(400);
      // Verificamos que los mensajes de error contengan información sobre las validaciones
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('age'),
          expect.stringContaining('email'),
          expect.stringContaining('subjects'),
          expect.stringContaining('gender')
        ])
      );
    });
  });

  describe('GET /students', () => {
    it('should require authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/students');

      expect(response.status).toBe(401);
    });

    it('should require admin role', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/students')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(403);
    });

    it('should get list of students with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ limit: 10, offset: 0 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /students/:id', () => {
    let studentId: string;

    beforeAll(async () => {
      // Crear un estudiante para pruebas
      const createResponse = await request(app.getHttpServer())
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testStudent,
          email: 'get-test@example.com' // Usar email diferente
        });

      studentId = createResponse.body.id;
    });

    afterAll(async () => {
      // Limpiar el estudiante creado
      await studentRepository.delete({ id: studentId });
    });

    it('should get a student by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(studentId);
      expect(response.body.name).toBe(testStudent.name);
    });

    it('should get a student by name', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/students/${testStudent.name}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(testStudent.name);
    });

    it('should return 404 for non-existent student', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/students/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /students/:id', () => {
    let studentId: string;

    beforeAll(async () => {
      // Crear un estudiante para pruebas
      const createResponse = await request(app.getHttpServer())
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testStudent,
          email: 'update-test@example.com' // Usar email diferente
        });

      studentId = createResponse.body.id;
    });

    afterAll(async () => {
      // Limpiar el estudiante creado
      await studentRepository.delete({ id: studentId });
    });

    it('should update a student', async () => {
      const updateData = {
        name: 'Updated Student',
        age: 21
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.age).toBe(updateData.age);
    });

    it('should validate update data', async () => {
      const invalidUpdateData = {
        age: -1 // Invalid age
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidUpdateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('age');
    });
  });

  describe('DELETE /students/:id', () => {
    let studentId: string;

    beforeEach(async () => {
      // Crear un estudiante para pruebas
      const createResponse = await request(app.getHttpServer())
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testStudent,
          email: `delete-test-${Date.now()}@example.com` // Usar email diferente y único
        });

      studentId = createResponse.body.id;
    });

    it('should delete a student', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);

      // Verificar que se haya eliminado
      const getResponse = await request(app.getHttpServer())
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent student', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/students/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});