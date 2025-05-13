import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from "../../../src/app.module";
import { Repository } from "typeorm";
import { Student } from "../../../src/students/entities/student.entity";
import { User } from "../../../src/auth/entities/user.entity";
import { JwtService } from "@nestjs/jwt";

jest.setTimeout(60000);

describe('StudentsModule (e2e)', () => {
  let app: INestApplication;
  let studentRepository: Repository<Student>;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
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

  // Función para generar estudiantes con email único
  const getUniqueTestStudent = () => {
    const timestamp = Date.now();
    return {
      name: `Test Student ${timestamp}`,
      age: 20,
      email: `student-${timestamp}@test.com`,
      subjects: ['Math', 'Science'],
      gender: 'Male',
      grades: [
        { subject: 'Math', grade: 4.5 },
        { subject: 'Science', grade: 4.2 }
      ]
    };
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    studentRepository = app.get<Repository<Student>>(getRepositoryToken(Student));
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    jwtService = app.get<JwtService>(JwtService);
    
    // Limpiar usuarios
    await userRepository.delete({ email: adminUser.email });
    await userRepository.delete({ email: teacherUser.email });

    // Crear admin directamente
    const hashedAdminPassword = bcrypt.hashSync(adminUser.password, 10);
    const admin = await userRepository.save({
      email: adminUser.email,
      password: hashedAdminPassword,
      fullName: adminUser.fullName,
      roles: ['admin'],
      isActive: true
    });
    adminToken = jwtService.sign({ id: admin.id });

    // Crear teacher directamente
    const hashedTeacherPassword = bcrypt.hashSync(teacherUser.password, 10);
    const teacher = await userRepository.save({
      email: teacherUser.email,
      password: hashedTeacherPassword,
      fullName: teacherUser.fullName,
      roles: ['teacher'],
      isActive: true
    });
    teacherToken = jwtService.sign({ id: teacher.id });
  });

  afterAll(async () => {
    try {
      // Limpiar usuarios
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
      const testStudent = getUniqueTestStudent();
      const response = await request(app.getHttpServer())
        .post('/api/students')
        .send(testStudent);

      expect(response.status).toBe(401);
    });

    it('should require admin role', async () => {
      const testStudent = getUniqueTestStudent();
      const response = await request(app.getHttpServer())
        .post('/api/students')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(testStudent);

      expect(response.status).toBe(403);
    });

    it('should create a student with valid data', async () => {
      const testStudent = getUniqueTestStudent();
      
      const response = await request(app.getHttpServer())
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testStudent);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testStudent.name);
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
    let studentName: string;

    beforeEach(async () => {
      // Crear un estudiante para pruebas con nombre único
      const testStudent = getUniqueTestStudent();
      
      const response = await request(app.getHttpServer())
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testStudent);

      studentId = response.body.id;
      studentName = response.body.name;
    });

    it('should get a student by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(studentId);
    });

    it('should get a student by name', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/students/${studentName}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(studentName);
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

    beforeEach(async () => {
      // Crear un estudiante para pruebas con nombre único
      const testStudent = getUniqueTestStudent();
      
      const response = await request(app.getHttpServer())
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testStudent);

      studentId = response.body.id;
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
    });
  });

  describe('DELETE /students/:id', () => {
    let studentId: string;

    beforeEach(async () => {
      // Crear un estudiante para pruebas con nombre único
      const testStudent = getUniqueTestStudent();
      
      const response = await request(app.getHttpServer())
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testStudent);

      studentId = response.body.id;
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
      // Usar un UUID válido pero que no existe
      const nonExistentUUID = '00000000-0000-0000-0000-000000000000';
      
      const response = await request(app.getHttpServer())
        .delete(`/api/students/${nonExistentUUID}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});