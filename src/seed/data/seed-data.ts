type UserRole = 'teacher' | 'admin' | 'student' | 'other'; // Definimos los posibles roles

interface SeedUser {
  fullName: string;
  email: string;
  password?: string;
  isActive?: boolean;
  roles: UserRole[];
}

interface SeedCourse {
  id: string;
  name: string;
  description: string;
  code: string;
  startDate: string;
  endDate: string;
}

interface SeedEnrollment {
  courseId: string;
  enrolledAt: string;
  score?: number;
}

interface SeedStudent {
  name: string;
  age: number;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  nickname?: string;
  enrollments: SeedEnrollment[];
}

interface SeedData {
  courses: SeedCourse[];
  students: SeedStudent[];
  users: SeedUser[]; // Aquí incluimos a los profesores
}

export const initialData: SeedData = {
  courses: [
    {
      id: "1bb45ec6-2078-41fb-a2c0-adc814496b29",
      name: "Matemáticas",
      description: "Curso de matemáticas básicas",
      code: "MATH101",
      startDate: "2025-05-01",
      endDate: "2025-06-01",
    },
    {
      id: "fb0a6168-614d-48c2-a871-d6b464aedf40",
      name: "Historia",
      description: "Curso de historia universal",
      code: "HIST101",
      startDate: "2025-05-02",
      endDate: "2025-06-02",
    },
    {
      id: "95a42c19-b8fe-47f1-a14c-9820a8865ac1",
      name: "Programación",
      description: "Curso de introducción a la programación",
      code: "PROG101",
      startDate: "2025-05-03",
      endDate: "2025-06-03",
    },
  ],
  students: [
    // Tu lista de estudiantes se queda igual
  ],
  users: [
    {
      fullName: "Carlos Rodríguez",
      email: "carlos.rodriguez@gmail.com",
      roles: ["teacher"],
    },
    {
      fullName: "María López",
      email: "maria.lopez@gmail.com",
      roles: ["teacher"],
    },
    {
      fullName: "Andrés Gómez",
      email: "andres.gomez@gmail.com",
      roles: ["teacher"],
    },
    {
      fullName: "Admin User",
      email: "admin@school.com",
      roles: ["admin"],
    },
  ],
};
