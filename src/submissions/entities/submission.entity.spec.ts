// src/submissions/entities/submission.entity.spec.ts
import { Submission } from './submission.entity';
import { Course } from '../../courses/entities/course.entity';
import { Student } from '../../students/entities/student.entity';

describe('Submission Entity', () => {
  let submission: Submission;
  let course: Course;
  let student: Student;

  beforeEach(() => {
    course = new Course();
    course.id = 'course-id';
    course.name = 'Test Course';

    student = new Student();
    student.id = 'student-id';
    student.name = 'Test Student';

    submission = new Submission();
    submission.id = 'submission-id';
    submission.course = course;
    submission.student = student;
    submission.fileUrl = 'https://example.com/file.pdf';
    submission.comments = 'Test submission';
    submission.grade = 4.5;
    submission.submittedAt = new Date('2025-05-10T12:00:00Z');
    submission.createdAt = new Date('2025-05-10T12:00:00Z');
    submission.updatedAt = new Date('2025-05-10T12:00:00Z');
  });

  it('should create a submission instance', () => {
    expect(submission).toBeDefined();
    expect(submission.id).toBe('submission-id');
    expect(submission.course).toBe(course);
    expect(submission.student).toBe(student);
    expect(submission.fileUrl).toBe('https://example.com/file.pdf');
    expect(submission.comments).toBe('Test submission');
    expect(submission.grade).toBe(4.5);
    expect(submission.submittedAt).toBeInstanceOf(Date);
    expect(submission.createdAt).toBeInstanceOf(Date);
    expect(submission.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow creating a submission with default values', () => {
    const defaultSubmission = new Submission();
    defaultSubmission.course = course;
    defaultSubmission.student = student;
    defaultSubmission.fileUrl = 'https://example.com/file.pdf';
    
    expect(defaultSubmission.comments).toBe(undefined);
    expect(defaultSubmission.grade).toBe(undefined);
  });

  it('should allow setting grade to null for ungraded submissions', () => {
    submission.grade = null;
    expect(submission.grade).toBeNull();
  });

  it('should allow updating submission properties', () => {
    submission.fileUrl = 'https://example.com/updated-file.pdf';
    submission.comments = 'Updated comments';
    submission.grade = 4.8;
    
    expect(submission.fileUrl).toBe('https://example.com/updated-file.pdf');
    expect(submission.comments).toBe('Updated comments');
    expect(submission.grade).toBe(4.8);
  });
});