import { Submission } from '../entities/submission.entity';
import { Course } from '../../courses/entities/course.entity';
import { Student } from '../../students/entities/student.entity';

describe('Submission Entity', () => {
  it('should create a submission instance with all properties', () => {
    const course = new Course();
    course.id = 'course-id';
    course.name = 'Test Course';
    
    const student = new Student();
    student.id = 'student-id';
    student.name = 'Test Student';
    
    const submission = new Submission();
    submission.id = 'submission-id';
    submission.course = course;
    submission.student = student;
    submission.fileUrl = 'https://example.com/file.pdf';
    submission.comments = 'Test submission';
    submission.grade = 95;
    submission.submittedAt = new Date();
    submission.createdAt = new Date();
    submission.updatedAt = new Date();
    
    expect(submission).toBeDefined();
    expect(submission.id).toBe('submission-id');
    expect(submission.course).toBe(course);
    expect(submission.student).toBe(student);
    expect(submission.fileUrl).toBe('https://example.com/file.pdf');
    expect(submission.comments).toBe('Test submission');
    expect(submission.grade).toBe(95);
    expect(submission.submittedAt).toBeInstanceOf(Date);
    expect(submission.createdAt).toBeInstanceOf(Date);
    expect(submission.updatedAt).toBeInstanceOf(Date);
  });
  
  it('should handle null grade', () => {
    const submission = new Submission();
    submission.grade = null;
    
    expect(submission.grade).toBeNull();
  });
});