import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from "../../../src/app.module";
import { Repository, Like } from "typeorm";
import { Course } from "../../../src/courses/entities/course.entity";
import { User } from "../../../src/auth/entities/user.entity";
import { CourseStatus } from "../../../src/courses/enums/course-status.enum";
import { JwtService } from "@nestjs/jwt";

jest.setTimeout(60000); // Aumentar tiempo de espera

describe('CoursesModule (e2e)', () => {
  let app: INestApplication;
  let courseRepository: Repository<Course>;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let adminToken: string;
  let teacherToken: string;
  let studentToken: string;
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

  const studentUser = {
    email: 'student-courses@test.com',
    password: 'Student123',
    fullName: 'Student User'
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
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    courseRepository = app.get<Repository<Course>>(getRepositoryToken(Course));
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    jwtService = app.get<JwtService>(JwtService);

    // Limpiar datos existentes
    await userRepository.delete({ email: adminUser.email });
    await userRepository.delete({ email: teacherUser.email });
    await userRepository.delete({ email: studentUser.email });
    await courseRepository.delete({ code: testCourse.code });
    await courseRepository.delete({ code: 'GET-101' });
    await courseRepository.delete({ code: 'PUT-101' });
    await courseRepository.delete({ code: Like('DELETE-%') });

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
    teacherId = teacher.id;
    teacherToken = jwtService.sign({ id: teacher.id });

    // Crear student directamente
    const hashedStudentPassword = bcrypt.hashSync(studentUser.password, 10);
    const student = await userRepository.save({
      email: studentUser.email,
      password: hashedStudentPassword,
      fullName: studentUser.fullName,
      roles: ['student'],
      isActive: true
    });
    studentToken = jwtService.sign({ id: student.id });
  });

  afterAll(async () => {
    try {
      // Limpiar datos de prueba
      await courseRepository.delete({ code: testCourse.code });
      await courseRepository.delete({ code: 'GET-101' });
      await courseRepository.delete({ code: 'PUT-101' });
      await courseRepository.delete({ code: Like('DELETE-%') });
      
      // Limpiar usuarios creados para las pruebas
      await userRepository.delete({ email: adminUser.email });
      await userRepository.delete({ email: teacherUser.email });
      await userRepository.delete({ email: studentUser.email });
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
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testCourse.name);
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
      const response = await request(app.getHttpServer())
        .get('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
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
      const course = courseRepository.create({
        ...testCourse,
        code: 'GET-101', // Código único
        teacher: { id: teacherId } as User,
        startDate: new Date(testCourse.startDate),
        endDate: new Date(testCourse.endDate)
      });
      
      const savedCourse = await courseRepository.save(course);
      courseId = savedCourse.id;
    });

    it('should get a course by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(courseId);
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
      const course = courseRepository.create({
        ...testCourse,
        code: 'PUT-101', // Código único
        teacher: { id: teacherId } as User,
        startDate: new Date(testCourse.startDate),
        endDate: new Date(testCourse.endDate)
      });
      
      const savedCourse = await courseRepository.save(course);
      courseId = savedCourse.id;
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
    });
  });

  describe('DELETE /courses/:id', () => {
    let courseId: string;

    beforeEach(async () => {
      // Crear un curso para pruebas con código único
      const uniqueCode = `DELETE-${Date.now()}`;
      const course = courseRepository.create({
        ...testCourse,
        code: uniqueCode,
        teacher: { id: teacherId } as User,
        startDate: new Date(testCourse.startDate),
        endDate: new Date(testCourse.endDate)
      });
      
      const savedCourse = await courseRepository.save(course);
      courseId = savedCourse.id;
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