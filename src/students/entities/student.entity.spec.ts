// src/students/entities/student.entity.spec.ts
import { Student } from './student.entity';
import { Grade } from './enrollment.entity';

describe('Student Entity', () => {
  let student: Student;

  beforeEach(() => {
    student = new Student();
    student.id = 'student-id';
    student.name = 'Test Student';
    student.age = 20;
    student.email = 'test@example.com';
    student.subjects = ['Math', 'Science'];
    student.gender = 'Male';
    student.nickname = 'test_nickname';
    student.grades = [];
  });

  it('should create a student instance', () => {
    expect(student).toBeDefined();
    expect(student.id).toBe('student-id');
    expect(student.name).toBe('Test Student');
    expect(student.age).toBe(20);
    expect(student.email).toBe('test@example.com');
    expect(student.subjects).toEqual(['Math', 'Science']);
    expect(student.gender).toBe('Male');
    expect(student.nickname).toBe('test_nickname');
    expect(student.grades).toEqual([]);
  });

  describe('checkNicknameInsert', () => {
    it('should create nickname from name if not provided', () => {
      const newStudent = new Student();
      newStudent.name = 'Test Student';
      newStudent.age = 20;
      newStudent.nickname = undefined;
      
      // Execute the BeforeInsert hook manually
      newStudent.checkNicknameInsert();
      
      expect(newStudent.nickname).toBe('test_student20');
    });
    
    it('should format existing nickname if provided', () => {
      const newStudent = new Student();
      newStudent.name = 'Test Student';
      newStudent.nickname = 'TestNickname';
      newStudent.age = 20;
      
      // Execute the BeforeInsert hook manually
      newStudent.checkNicknameInsert();
      
      expect(newStudent.nickname).toBe('testnickname20');
    });

    it('should handle spaces in name when creating nickname', () => {
      const newStudent = new Student();
      newStudent.name = 'Test Student Name';
      newStudent.age = 20;
      newStudent.nickname = undefined;
      
      // Execute the BeforeInsert hook manually
      newStudent.checkNicknameInsert();
      
      expect(newStudent.nickname).toBe('test_student_name20');
    });
  });
  
  describe('checkNickNameUpdate', () => {
    it('should format nickname on update', () => {
      const updatedStudent = new Student();
      updatedStudent.nickname = 'TestNickname';
      updatedStudent.age = 21;
      
      // Execute the BeforeUpdate hook manually
      updatedStudent.checkNickNameUpdate();
      
      expect(updatedStudent.nickname).toBe('testnickname21');
    });

    it('should format nickname with spaces correctly', () => {
      const updatedStudent = new Student();
      updatedStudent.nickname = 'Test Nickname';
      updatedStudent.age = 21;
      
      // Execute the BeforeUpdate hook manually
      updatedStudent.checkNickNameUpdate();
      
      expect(updatedStudent.nickname).toBe('test_nickname21');
    });
  });
});