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

interface SeedSubmission {
  courseId: string;
  studentEmail: string;
  fileUrl: string;
  comments?: string;
  grade?: number;
  submittedAt: string;
}

interface SeedData {
  courses: SeedCourse[];
  students: SeedStudent[];
  users: SeedUser[];
  submissions: SeedSubmission[]; // 👈 nuevo
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
    {
      name: "Laura Torres",
      age: 20,
      email: "laura.torres@example.com",
      gender: "Female",
      enrollments: [
        { courseId: "1bb45ec6-2078-41fb-a2c0-adc814496b29", enrolledAt: "2025-05-01" },
        { courseId: "95a42c19-b8fe-47f1-a14c-9820a8865ac1", enrolledAt: "2025-05-03" },
      ],
    },
    {
      name: "Miguel Fernández",
      age: 22,
      email: "miguel.fernandez@example.com",
      gender: "Male",
      enrollments: [
        { courseId: "fb0a6168-614d-48c2-a871-d6b464aedf40", enrolledAt: "2025-05-02" },
      ],
    },
    {
      name: "Ana Ruiz",
      age: 21,
      email: "ana.ruiz@example.com",
      gender: "Female",
      enrollments: [
        { courseId: "95a42c19-b8fe-47f1-a14c-9820a8865ac1", enrolledAt: "2025-05-03" },
      ],
    },
  ],
  users: [
    {
      fullName: "Carlos Rodríguez",
      email: "carlos.rodriguez@gmail.com",
      password: "teacher123",
      roles: ["teacher"],
    },
    {
      fullName: "María López",
      email: "maria.lopez@gmail.com",
      password: "teacher123",
      roles: ["teacher"],
    },
    {
      fullName: "Andrés Gómez",
      email: "andres.gomez@gmail.com",
      password: "teacher123",
      roles: ["teacher"],
    },
    {
      fullName: "Admin User",
      email: "admin@school.com",
      password: "admin123",
      roles: ["admin"],
    },
  ],
  submissions: [
    {
      courseId: "1bb45ec6-2078-41fb-a2c0-adc814496b29", // Matemáticas
      studentEmail: "laura.torres@example.com",
      fileUrl: "https://drive.google.com/file/math1",
      comments: "Primera entrega de ejercicios",
      grade: 88,
      submittedAt: "2025-05-10T12:00:00Z",
    },
    {
      courseId: "95a42c19-b8fe-47f1-a14c-9820a8865ac1", // Programación
      studentEmail: "ana.ruiz@example.com",
      fileUrl: "https://drive.google.com/file/prog1",
      comments: "Entrega de práctica 1",
      grade: 92,
      submittedAt: "2025-05-15T09:30:00Z",
    },
    {
      courseId: "fb0a6168-614d-48c2-a871-d6b464aedf40", // Historia
      studentEmail: "miguel.fernandez@example.com",
      fileUrl: "https://drive.google.com/file/hist1",
      comments: "Ensayo sobre la Revolución Francesa",
      grade: 75,
      submittedAt: "2025-05-12T16:00:00Z",
    },
  ],
};
