import { CommonsModule } from './commons/commons.module';
import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from './students/students.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { SeedModule } from './seed/seed.module';

describe('Module Tests', () => {
  it('should define CommonsModule', () => {
    expect(CommonsModule).toBeDefined();
  });

  it('should define CoursesModule', () => {
    expect(CoursesModule).toBeDefined();
  });

  it('should define StudentsModule', () => {
    expect(StudentsModule).toBeDefined();
  });

  it('should define SubmissionsModule', () => {
    expect(SubmissionsModule).toBeDefined();
  });

  it('should define SeedModule', () => {
    expect(SeedModule).toBeDefined();
  });
});