// src/courses/entities/course.entity.spec.ts
import { Course } from './course.entity';
import { User } from '../../auth/entities/user.entity';
import { CourseStatus } from '../enums/course-status.enum';

describe('Course Entity', () => {
  let course: Course;
  let teacher: User;

  beforeEach(() => {
    teacher = new User();
    teacher.id = 'teacher-id';
    teacher.email = 'teacher@example.com';
    teacher.fullName = 'Teacher Name';

    course = new Course();
    course.id = 'course-id';
    course.name = 'Test Course';
    course.description = 'Test course description';
    course.code = 'TEST-101';
    course.teacher = teacher;
    course.status = CourseStatus.ACTIVE;
    course.startDate = new Date('2025-01-01');
    course.endDate = new Date('2025-06-30');
    course.createdAt = new Date();
    course.updatedAt = new Date();
  });

  it('should create a course instance', () => {
    expect(course).toBeDefined();
    expect(course.id).toBe('course-id');
    expect(course.name).toBe('Test Course');
    expect(course.description).toBe('Test course description');
    expect(course.code).toBe('TEST-101');
    expect(course.teacher).toBe(teacher);
    expect(course.status).toBe(CourseStatus.ACTIVE);
    expect(course.startDate).toBeInstanceOf(Date);
    expect(course.endDate).toBeInstanceOf(Date);
    expect(course.createdAt).toBeInstanceOf(Date);
    expect(course.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a course with default status if not provided', () => {
    const defaultCourse = new Course();
    defaultCourse.name = 'Default Course';
    defaultCourse.description = 'Default course description';
    defaultCourse.code = 'DEFAULT-101';
    defaultCourse.teacher = teacher;
    defaultCourse.startDate = new Date('2025-01-01');
    defaultCourse.endDate = new Date('2025-06-30');
    
    // El valor por defecto se establece a nivel de base de datos, así que aquí sería undefined
    expect(defaultCourse.status).toBe(undefined);
  });

  it('should allow updating course properties', () => {
    course.name = 'Updated Course';
    course.description = 'Updated description';
    course.status = CourseStatus.INACTIVE;
    
    expect(course.name).toBe('Updated Course');
    expect(course.description).toBe('Updated description');
    expect(course.status).toBe(CourseStatus.INACTIVE);
  });

  it('should allow changing the teacher', () => {
    const newTeacher = new User();
    newTeacher.id = 'new-teacher-id';
    newTeacher.email = 'new-teacher@example.com';
    newTeacher.fullName = 'New Teacher';
    
    course.teacher = newTeacher;
    
    expect(course.teacher).toBe(newTeacher);
    expect(course.teacher.id).toBe('new-teacher-id');
  });
});