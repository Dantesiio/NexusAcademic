// src/students/entities/grade.entity.spec.ts
import { Grade } from './grade.entity';
import { Student } from './student.entity';

describe('Grade Entity', () => {
  let grade: Grade;
  let student: Student;

  beforeEach(() => {
    student = new Student();
    student.id = 'student-id';
    student.name = 'Test Student';
    
    grade = new Grade();
    grade.id = 'grade-id';
    grade.subject = 'Math';
    grade.grade = 4.5;
    grade.student = student;
  });

  it('should create a grade instance', () => {
    expect(grade).toBeDefined();
    expect(grade.id).toBe('grade-id');
    expect(grade.subject).toBe('Math');
    expect(grade.grade).toBe(4.5);
    expect(grade.student).toBe(student);
  });

  it('should allow creating a grade with null id', () => {
    const newGrade = new Grade();
    newGrade.subject = 'Science';
    newGrade.grade = 4.0;
    
    expect(newGrade.id).toBeUndefined();
    expect(newGrade.subject).toBe('Science');
    expect(newGrade.grade).toBe(4.0);
  });

  it('should allow updating grade properties', () => {
    grade.subject = 'Advanced Math';
    grade.grade = 5.0;
    
    expect(grade.subject).toBe('Advanced Math');
    expect(grade.grade).toBe(5.0);
  });

  it('should allow setting student to null', () => {
    grade.student = undefined;
    
    expect(grade.student).toBeUndefined();
  });
});