import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from 'supertest';
import { AppModule } from "src/app.module";
import { Repository } from "typeorm";
import { Submission } from "src/submissions/entities/submission.entity";
import { User } from "src/auth/entities/user.entity";
import { Course } from "src/courses/entities/course.entity";
import { Student } from "src/students/entities/student.entity";
import { CourseStatus } from "src/courses/enums/course-status.enum";

// Aumentar el tiempo de espera para pruebas e2e
jest.setTimeout(30000);

describe('SubmissionsModule (e2e)', () => {
  let app: INestApplication;
  let submissionRepository: Repository<Submission>;
  let userRepository: Repository<User>;
  let courseRepository: Repository<Course>;
  let studentRepository: Repository<Student>;
  let adminToken: string;
  let teacherToken: string;
  let teacherId: string;
  let courseId: string;
  let studentId: string;

  const adminUser = {
    email: 'admin-submissions@test.com',
    password: 'Admin123',
    fullName: 'Admin User'
  };

  const teacherUser = {
    email: 'teacher-submissions@test.com',
    password: 'Teacher123',
    fullName: 'Teacher User'
  };

  const testStudent = {
    name: 'Submission Test Student',
    age: 20,
    email: 'submission-student@test.com',
    subjects: ['Math', 'Science'],
    gender: 'Male'
  };

  const testCourse = {
    name: 'Submission Test Course',
    description: 'Test course for submissions',
    code: 'SUB-101',
    status: CourseStatus.ACTIVE,
    startDate: '2025-06-01',
    endDate: '2025-07-30'
  };

  const testSubmission = {
    fileUrl: 'https://example.com/file.pdf',
    comments: 'Test submission'
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

    submissionRepository = app.get<Repository<Submission>>(getRepositoryToken(Submission));
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    courseRepository = app.get<Repository<Course>>(getRepositoryToken(Course));
    studentRepository = app.get<Repository<Student>>(getRepositoryToken(Student));

    // Crear usuarios
    const adminResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(adminUser);
    
    await userRepository.update(
      { email: adminUser.email }, 
      { roles: ['admin'] }
    );

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

    // Crear curso
    const courseResponse = await request(app.getHttpServer())
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ...testCourse,
        teacherId
      });
    
    courseId = courseResponse.body.id;

    // Crear estudiante
    const studentResponse = await request(app.getHttpServer())
      .post('/api/students')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testStudent);
    
    studentId = studentResponse.body.id;
  });

  afterAll(async () => {
    try {
      // Limpiar datos de prueba
      await submissionRepository.delete({});
      await courseRepository.delete({ id: courseId });
      await studentRepository.delete({ id: studentId });
      await userRepository.delete({ email: adminUser.email });
      await userRepository.delete({ email: teacherUser.email });
    } catch (error) {
      console.error('Error durante la limpieza:', error);
    } finally {
      await app.close();
    }
  });

  describe('POST /submissions', () => {
    it('should require authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/submissions')
        .send({
          ...testSubmission,
          courseId,
          studentId
        });

      expect(response.status).toBe(401);
    });

    it('should create a submission with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/submissions')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          ...testSubmission,
          courseId,
          studentId
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        fileUrl: testSubmission.fileUrl,
        comments: testSubmission.comments,
        grade: null,
        submittedAt: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        course: expect.objectContaining({
          id: courseId,
          name: testCourse.name
        }),
        student: expect.objectContaining({
          id: studentId,
          name: testStudent.name
        })
      });
    });

    it('should validate submission data', async () => {
      const invalidSubmission = {
        fileUrl: '', // Empty fileUrl
        courseId: 'invalid-id', // Invalid UUID
        studentId: 'invalid-id' // Invalid UUID
      };

      const response = await request(app.getHttpServer())
        .post('/api/submissions')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(invalidSubmission);

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('fileUrl'),
          expect.stringContaining('courseId'),
          expect.stringContaining('studentId')
        ])
      );
    });

    it('should check for duplicate submissions', async () => {
      // Crear una primera entrega exitosa
      await request(app.getHttpServer())
        .post('/api/submissions')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          ...testSubmission,
          courseId,
          studentId
        });

      // Intentar crear una segunda entrega con los mismos datos
      const response = await request(app.getHttpServer())
        .post('/api/submissions')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          ...testSubmission,
          courseId,
          studentId
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Submission already exists');
    });
  });

  describe('GET /submissions', () => {
    it('should require authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/submissions');

      expect(response.status).toBe(401);
    });

    it('should return a list of submissions', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/submissions')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /submissions/:id', () => {
    let submissionId: string;

    beforeAll(async () => {
      // Crear una nueva entrega para las pruebas
      const uniqueCode = `SUB-GET-${Date.now()}`;
      
      // Primero creamos un nuevo curso para evitar duplicados
      const courseResponse = await request(app.getHttpServer())
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testCourse,
          code: uniqueCode,
          teacherId
        });
      
      const newCourseId = courseResponse.body.id;

      // Luego creamos una nueva entrega
      const submissionResponse = await request(app.getHttpServer())
        .post('/api/submissions')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          ...testSubmission,
          courseId: newCourseId,
          studentId,
          fileUrl: `https://example.com/file-${uniqueCode}.pdf`
        });

      submissionId = submissionResponse.body.id;
    });

    it('should get a submission by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/submissions/${submissionId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(submissionId);
      expect(response.body.fileUrl).toContain('https://example.com');
    });

    it('should return 404 for non-existent submission', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/submissions/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /submissions/:id/grade', () => {
    let submissionId: string;

    beforeAll(async () => {
      // Crear una nueva entrega para las pruebas
      const uniqueCode = `SUB-GRADE-${Date.now()}`;
      
      // Primero creamos un nuevo curso para evitar duplicados
      const courseResponse = await request(app.getHttpServer())
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testCourse,
          code: uniqueCode,
          teacherId
        });
      
      const newCourseId = courseResponse.body.id;

      // Luego creamos una nueva entrega
      const submissionResponse = await request(app.getHttpServer())
        .post('/api/submissions')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          ...testSubmission,
          courseId: newCourseId,
          studentId,
          fileUrl: `https://example.com/file-${uniqueCode}.pdf`
        });

      submissionId = submissionResponse.body.id;
    });

    it('should grade a submission', async () => {
      const gradeData = {
        grade: 4.5,
        comments: 'Good work'
      };

      const response = await request(app.getHttpServer())
        .put(`/api/submissions/${submissionId}/grade`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(gradeData);

      expect(response.status).toBe(200);
      expect(response.body.grade).toBe(gradeData.grade);
      expect(response.body.comments).toBe(gradeData.comments);
    });

    it('should validate grade data', async () => {
      const invalidGradeData = {
        grade: 6, // Grade should be between 0 and 5
        comments: 'Invalid grade'
      };

      const response = await request(app.getHttpServer())
        .put(`/api/submissions/${submissionId}/grade`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(invalidGradeData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('grade');
    });
  });

  describe('DELETE /submissions/:id', () => {
    let submissionId: string;

    beforeEach(async () => {
      // Crear una nueva entrega para las pruebas
      const uniqueCode = `SUB-DELETE-${Date.now()}`;
      
      // Primero creamos un nuevo curso para evitar duplicados
      const courseResponse = await request(app.getHttpServer())
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...testCourse,
          code: uniqueCode,
          teacherId
        });
      
      const newCourseId = courseResponse.body.id;

      // Luego creamos una nueva entrega
      const submissionResponse = await request(app.getHttpServer())
        .post('/api/submissions')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          ...testSubmission,
          courseId: newCourseId,
          studentId,
          fileUrl: `https://example.com/file-${uniqueCode}.pdf`
        });

      submissionId = submissionResponse.body.id;
    });

    it('should require admin role', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/submissions/${submissionId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(403);
    });

    it('should delete a submission', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/submissions/${submissionId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);

      // Verificar que se haya eliminado
      const getResponse = await request(app.getHttpServer())
        .get(`/api/submissions/${submissionId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});