import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from 'supertest';
import { AppModule } from "src/app.module";
import { Repository } from "typeorm";
import { Course } from "src/courses/entities/course.entity";
import { User } from "src/auth/entities/user.entity";
import { CourseStatus } from "src/courses/enums/course-status.enum";

// Aumentar el tiempo de espera para pruebas e2e
jest.setTimeout(30000);

describe('CoursesModule (e2e)', () => {
  let app: INestApplication;
  let courseRepository: Repository<Course>;
  let userRepository: Repository<User>;
  let adminToken: string;
  let teacherToken: string;
  let teacherId: string;

  const adminUser = {
    email: 'admin-courses@test.com',
    password: 'Admin123',
    fullName: 'Admin User'
  };

  const teacherUser = {
    email: 'teacher-courses@test.com',
    password: 'Teacher123',
    fullName: 'Teacher User'
  };

  const testCourse = {
    name: 'Test Course',
    description: 'Test course description',
    code: 'TEST-101',
    status: CourseStatus.ACTIVE,
    startDate: '2025-06-01',
    endDate: '2025-07-30'
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

    // Establecer el prefijo global
    app.setGlobalPrefix('api');

    await app.init();

    courseRepository = app.get<Repository<Course>>(getRepositoryToken(Course));
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));

    // Crear usuario admin
    const adminResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(adminUser);
    
    // Actualizar a rol admin
    await userRepository.update(
      { email: adminUser.email }, 
      { roles: ['admin'] }
    );

    // Crear usuario teacher
    const teacherResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(teacherUser);
    
    teacherId = teacherResponse.body.id;

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
      await courseRepository.delete({ code: testCourse.code });
      
      // Limpiar usuarios creados para las pruebas
      await userRepository.delete({ email: adminUser.email });
      await userRepository.delete({ email: teacherUser.email });
    } catch (error) {
      console.error('Error durante la limpieza:', error);
    } finally {
      await app.close();
    }
  });

  describe('POST /courses', () => {
    it('should require authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/courses')
        .send({
          ...testCourse,
          teacherId
        });

      expect(response.status).toBe(401);
    });

    it('should require admin role', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/courses')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          ...testCourse,
          teacherId
        });

      expect(response.status).toBe(403);
    });

    it('should create a course with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testCourse,
          teacherId
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: testCourse.name,
        description: testCourse.description,
        code: testCourse.code,
        status: testCourse.status,
        startDate: expect.any(String),
        endDate: expect.any(String),
        teacher: expect.objectContaining({
          id: teacherId,
          email: teacherUser.email,
          fullName: teacherUser.fullName
        }),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it('should validate course data', async () => {
      const invalidCourse = {
        name: '', // Empty name
        description: '', // Empty description
        code: '', // Empty code
        teacherId: 'invalid-id', // Invalid UUID
        startDate: 'invalid-date', // Invalid date
        endDate: '2025-07-30'
      };

      const response = await request(app.getHttpServer())
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidCourse);

      expect(response.status).toBe(400);
      // Verificamos que contenga mensajes de error sobre los campos inválidos
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('name'),
          expect.stringContaining('description'),
          expect.stringContaining('code'),
          expect.stringContaining('teacherId'),
          expect.stringContaining('startDate')
        ])
      );
    });

    it('should validate that end date is after start date', async () => {
      const invalidDates = {
        ...testCourse,
        teacherId,
        code: 'TEST-102', // Different code to avoid duplicate
        startDate: '2025-08-01',
        endDate: '2025-07-01' // End date before start date
      };

      const response = await request(app.getHttpServer())
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidDates);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('endDate must be after startDate');
    });
  });

  describe('GET /courses', () => {
    it('should require authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/courses');

      expect(response.status).toBe(401);
    });

    it('should require teacher or admin role', async () => {
      // Create a student user
      const studentUser = {
        email: 'student-courses@test.com',
        password: 'Student123',
        fullName: 'Student User'
      };

      const studentResponse = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(studentUser);
      
      await userRepository.update(
        { email: studentUser.email }, 
        { roles: ['student'] }
      );

      const studentLoginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: studentUser.email, password: studentUser.password });
      
      const studentToken = studentLoginResponse.body.token;

      const response = await request(app.getHttpServer())
        .get('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);

      // Clean up student user
      await userRepository.delete({ email: studentUser.email });
    });

    it('should get list of courses', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /courses/:id', () => {
    let courseId: string;

    beforeAll(async () => {
      // Crear un curso para pruebas
      const createResponse = await request(app.getHttpServer())
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testCourse,
          code: 'GET-101', // Código único
          teacherId
        });

      courseId = createResponse.body.id;
    });

    afterAll(async () => {
      // Limpiar el curso creado
      await courseRepository.delete({ id: courseId });
    });

    it('should get a course by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(courseId);
      expect(response.body.name).toBe(testCourse.name);
    });

    it('should return 404 for non-existent course', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/courses/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /courses/:id', () => {
    let courseId: string;

    beforeAll(async () => {
      // Crear un curso para pruebas
      const createResponse = await request(app.getHttpServer())
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testCourse,
          code: 'PUT-101', // Código único
          teacherId
        });

      courseId = createResponse.body.id;
    });

    afterAll(async () => {
      // Limpiar el curso creado
      await courseRepository.delete({ id: courseId });
    });

    it('should require admin role', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          name: 'Updated Course'
        });

      expect(response.status).toBe(403);
    });

    it('should update a course', async () => {
      const updateData = {
        name: 'Updated Course',
        description: 'Updated description'
      };

      const response = await request(app.getHttpServer())
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
    });
  });

  describe('DELETE /courses/:id', () => {
    let courseId: string;

    beforeEach(async () => {
      // Crear un curso para pruebas
      const createResponse = await request(app.getHttpServer())
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testCourse,
          code: `DELETE-${Date.now()}`, // Código único
          teacherId
        });

      courseId = createResponse.body.id;
    });

    it('should require admin role', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(403);
    });

    it('should delete a course', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);

      // Verificar que se haya eliminado
      const getResponse = await request(app.getHttpServer())
        .get(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});