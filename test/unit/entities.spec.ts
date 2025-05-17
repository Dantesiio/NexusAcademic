import { Course } from '../../src/courses/entities/course.entity';
import { Grade } from '../../src/students/entities/enrollment.entity';
import { Student } from '../../src/students/entities/student.entity';
import { Submission } from '../../src/submissions/entities/submission.entity';
import { User } from '../../src/auth/entities/user.entity';
import { CourseStatus } from '../../src/courses/enums/course-status.enum';

describe('Entity Class Coverage Tests', () => {
  describe('Course Entity', () => {
    it('should create a course with all fields', () => {
      const course = new Course();
      course.id = 'course-id';
      course.name = 'Test Course';
      course.description = 'Test Description';
      course.code = 'TEST-101';
      course.status = CourseStatus.ACTIVE;
      course.startDate = new Date('2023-01-01');
      course.endDate = new Date('2023-06-30');
      course.createdAt = new Date();
      course.updatedAt = new Date();
      course.teacher = new User();
      
      expect(course).toBeDefined();
      expect(course.id).toBe('course-id');
      expect(course.code).toBe('TEST-101');
      expect(course.teacher).toBeInstanceOf(User);
    });
  });
  
  describe('Grade Entity', () => {
    it('should create a grade with all fields', () => {
      const grade = new Grade();
      grade.id = 'grade-id';
      grade.subject = 'Math';
      grade.grade = 95;
      
      const student = new Student();
      student.id = 'student-id';
      grade.student = student;
      
      expect(grade).toBeDefined();
      expect(grade.id).toBe('grade-id');
      expect(grade.subject).toBe('Math');
      expect(grade.grade).toBe(95);
      expect(grade.student).toBe(student);
    });
  });
  
  describe('Student Entity', () => {
    it('should create a student and execute hooks', () => {
      const student = new Student();
      student.id = 'student-id';
      student.name = 'Test Student';
      student.age = 20;
      student.email = 'test@example.com';
      student.subjects = ['Math', 'Science'];
      student.gender = 'Male';
      
      expect(student).toBeDefined();
      
      // Test hooks
      student.checkNicknameInsert();
      expect(student.nickname).toBe('test_student20');
      
      student.nickname = 'different';
      student.checkNickNameUpdate();
      expect(student.nickname).toBe('different20');
    });
    
    it('should handle grades relation', () => {
      const student = new Student();
      student.id = 'student-id';
      student.grades = [
        { id: 'grade1', subject: 'Math', grade: 95 } as Grade,
        { id: 'grade2', subject: 'Science', grade: 90 } as Grade
      ];
      
      expect(student.grades).toHaveLength(2);
      expect(student.grades[0].subject).toBe('Math');
    });
  });
  
  describe('Submission Entity', () => {
    it('should create a submission with all fields', () => {
      const submission = new Submission();
      submission.id = 'submission-id';
      submission.fileUrl = 'https://example.com/file.pdf';
      submission.comments = 'Test submission';
      submission.grade = 95;
      submission.submittedAt = new Date();
      submission.createdAt = new Date();
      submission.updatedAt = new Date();
      
      const course = new Course();
      course.id = 'course-id';
      submission.course = course;
      
      const student = new Student();
      student.id = 'student-id';
      submission.student = student;
      
      expect(submission).toBeDefined();
      expect(submission.id).toBe('submission-id');
      expect(submission.fileUrl).toBe('https://example.com/file.pdf');
      expect(submission.course).toBe(course);
      expect(submission.student).toBe(student);
    });
  });
});