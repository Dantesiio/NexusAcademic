import { Injectable } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { initialData } from './data/seed-data';
import { Student } from '../students/entities/student.entity';
import { AuthService } from '../auth/auth.service';
import { CoursesService } from '../courses/service/courses.service';

@Injectable()
export class SeedService {

  constructor(
    private readonly studentService: StudentsService,
    private readonly authService: AuthService,
    private readonly coursesService: CoursesService,
  ){}

  async runSeed() {
    // 1. Crear profesores
    await this.deleteAll();
    const teachers = [
      {
        email: 'teacher1@nexus.com',
        password: 'Teacher123',
        fullName: 'Profesor Matemáticas',
      },
      {
        email: 'teacher2@nexus.com',
        password: 'Teacher123',
        fullName: 'Profesor Historia',
      },
      {
        email: 'teacher3@nexus.com',
        password: 'Teacher123',
        fullName: 'Profesor Programación',
      },
    ];

    type CreatedUser = { id: string; [key: string]: any };
    const createdTeachers: CreatedUser[] = [];
    for (const t of teachers) {
      const user = await this.authService.create(t);
      if (user && user.id) {
        createdTeachers.push(user as CreatedUser);
      } else {
        throw new Error('No se pudo crear el profesor');
      }
    }

    // 1. Crear cursos
    for (let idx = 0; idx < initialData.courses.length; idx++) {
      const courseSeed = initialData.courses[idx];
      const courseToCreate = {
        ...courseSeed,
        teacherId: createdTeachers[idx].id,
      };
      await this.coursesService.create(courseToCreate);
    }

    // 2. Obtener mapping de code a entidad Course real
    const allCourses = await this.coursesService['courseRepo'].find();
    const courseIdMap: Record<number, string> = {};
    for (const courseSeed of initialData.courses) {
      const realCourse = allCourses.find(c => c.code === courseSeed.code);
      if (realCourse) {
        courseIdMap[courseSeed.id] = realCourse.id;
      }
    }

    // 3. Crear estudiantes, asociando el UUID real en cada enrollment
    const students = initialData.students.map(student => ({
      ...student,
      enrollments: student.enrollments.map(enrollment => {
        const realCourseId = courseIdMap[enrollment.courseId]; // Este es el paso clave
        if (!realCourseId) throw new Error('No se encontró el curso para el enrollment');
        return {
          ...enrollment,
          courseId: realCourseId,
        };
      }),
    }));
    // 4. Crear estudiantes con enrollments corregidos
    const insertPromises: Promise<Student | undefined>[] = [];
    students.forEach(student => {
      insertPromises.push(this.studentService.create(student));
    });
    await Promise.all(insertPromises);
    return 'SEED EXECUTED';
  }

  async deleteAll() {
    // Borra submissions si tienes el repositorio
    if (this.coursesService['subRepo']) {
      await this.coursesService['subRepo'].delete({});
    }
    // Borra enrollments si tienes el repositorio
    if (this.coursesService['enrollmentRepo']) {
      await this.coursesService['enrollmentRepo'].delete({});
    }

    // Borra estudiantes
    await this.studentService.deleteAllStudents();

    // Borra cursos
    if (this.coursesService['courseRepo']) {
      await this.coursesService['courseRepo'].delete({});
    }

    // Borra usuarios (profesores)
    const teacherEmails = [
      'teacher1@nexus.com',
      'teacher2@nexus.com',
      'teacher3@nexus.com',
    ];
    if (this.authService['userRepository']) {
      for (const email of teacherEmails) {
        await this.authService['userRepository'].delete({ email });
      }
    }
  }
}
