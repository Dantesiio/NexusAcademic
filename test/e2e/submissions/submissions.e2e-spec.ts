import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from "../../../src/app.module";
import { Repository, Like } from "typeorm";
import { Submission } from "../../../src/submissions/entities/submission.entity";
import { User } from "../../../src/auth/entities/user.entity";
import { Course } from "../../../src/courses/entities/course.entity";
import { Student } from "../../../src/students/entities/student.entity";
import { CourseStatus } from "../../../src/courses/enums/course-status.enum";
import { JwtService } from "@nestjs/jwt";

jest.setTimeout(60000); // Aumentar tiempo de espera

describe('SubmissionsModule (e2e)', () => {
  let app: INestApplication;
  let submissionRepository: Repository<Submission>;
  let userRepository: Repository<User>;
  let courseRepository: Repository<Course>;
  let studentRepository: Repository<Student>;
  let jwtService: JwtService;
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
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    submissionRepository = app.get<Repository<Submission>>(getRepositoryToken(Submission));
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    courseRepository = app.get<Repository<Course>>(getRepositoryToken(Course));
    studentRepository = app.get<Repository<Student>>(getRepositoryToken(Student));
    jwtService = app.get<JwtService>(JwtService);

    // Limpiar datos existentes
    await submissionRepository.delete({}); // Eliminar todas las submissions
    await userRepository.delete({ email: adminUser.email });
    await userRepository.delete({ email: teacherUser.email });
    await studentRepository.delete({ email: testStudent.email });
    await courseRepository.delete({ code: testCourse.code });
    await courseRepository.delete({ code: Like('SUB-GET-%') });
    await courseRepository.delete({ code: Like('SUB-GRADE-%') });
    await courseRepository.delete({ code: Like('SUB-DELETE-%') });

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

    // Crear estudiante directamente
    const newStudent = studentRepository.create({
      ...testStudent,
      grades: []
    });
    const savedStudent = await studentRepository.save(newStudent);
    studentId = savedStudent.id;

    // Crear curso directamente
    const course = courseRepository.create({
      ...testCourse,
      teacher: { id: teacherId } as User,
      startDate: new Date(testCourse.startDate),
      endDate: new Date(testCourse.endDate)
    });
    const savedCourse = await courseRepository.save(course);
    courseId = savedCourse.id;
  });

  afterAll(async () => {
    try {
      // Limpiar datos de prueba
      await submissionRepository.delete({});
      await courseRepository.delete({ id: courseId });
      await courseRepository.delete({ code: Like('SUB-GET-%') });
      await courseRepository.delete({ code: Like('SUB-GRADE-%') });
      await courseRepository.delete({ code: Like('SUB-DELETE-%') });
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
      expect(response.body).toHaveProperty('id');
      expect(response.body.fileUrl).toBe(testSubmission.fileUrl);
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
    });

    it('should check for duplicate submissions', async () => {
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
      const course = courseRepository.create({
        ...testCourse,
        code: uniqueCode,
        teacher: { id: teacherId } as User,
        startDate: new Date(testCourse.startDate),
        endDate: new Date(testCourse.endDate)
      });
      const savedCourse = await courseRepository.save(course);
      
      // Luego creamos una nueva entrega directamente
      const submission = submissionRepository.create({
        fileUrl: `https://example.com/file-${uniqueCode}.pdf`,
        comments: testSubmission.comments,
        course: savedCourse,
        student: { id: studentId } as Student
      });
      const savedSubmission = await submissionRepository.save(submission);
      submissionId = savedSubmission.id;
    });

    it('should get a submission by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/submissions/${submissionId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(submissionId);
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
      const course = courseRepository.create({
        ...testCourse,
        code: uniqueCode,
        teacher: { id: teacherId } as User,
        startDate: new Date(testCourse.startDate),
        endDate: new Date(testCourse.endDate)
      });
      const savedCourse = await courseRepository.save(course);
      
      // Luego creamos una nueva entrega directamente
      const submission = submissionRepository.create({
        fileUrl: `https://example.com/file-${uniqueCode}.pdf`,
        comments: testSubmission.comments,
        course: savedCourse,
        student: { id: studentId } as Student
      });
      const savedSubmission = await submissionRepository.save(submission);
      submissionId = savedSubmission.id;
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
    });
  });

  describe('DELETE /submissions/:id', () => {
    let submissionId: string;

    beforeEach(async () => {
      // Crear una nueva entrega para las pruebas
      const uniqueCode = `SUB-DELETE-${Date.now()}`;
      
      // Primero creamos un nuevo curso para evitar duplicados
      const course = courseRepository.create({
        ...testCourse,
        code: uniqueCode,
        teacher: { id: teacherId } as User,
        startDate: new Date(testCourse.startDate),
        endDate: new Date(testCourse.endDate)
      });
      const savedCourse = await courseRepository.save(course);
      
      // Luego creamos una nueva entrega directamente
      const submission = submissionRepository.create({
        fileUrl: `https://example.com/file-${uniqueCode}.pdf`,
        comments: testSubmission.comments,
        course: savedCourse,
        student: { id: studentId } as Student
      });
      const savedSubmission = await submissionRepository.save(submission);
      submissionId = savedSubmission.id;
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