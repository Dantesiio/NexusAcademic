type UserRole = 'teacher' | 'admin' | 'student' | 'other';

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
  submissions: SeedSubmission[];
}

export const initialData: SeedData = {
  courses: [
    {
      id: "1bb45ec6-2078-41fb-a2c0-adc814496b29",
      name: "Matemáticas Básicas",
      description: "Curso fundamental de matemáticas con álgebra, geometría y trigonometría",
      code: "MATH101",
      startDate: "2025-05-01",
      endDate: "2025-06-01",
    },
    {
      id: "fb0a6168-614d-48c2-a871-d6b464aedf40",
      name: "Historia Universal",
      description: "Recorrido por los eventos más importantes de la historia mundial",
      code: "HIST101",
      startDate: "2025-05-02",
      endDate: "2025-06-02",
    },
    {
      id: "95a42c19-b8fe-47f1-a14c-9820a8865ac1",
      name: "Introducción a la Programación",
      description: "Fundamentos de programación con Python y conceptos básicos de algoritmia",
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
        { courseId: "1bb45ec6-2078-41fb-a2c0-adc814496b29", enrolledAt: "2025-05-05" },
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
    {
      name: "Carlos López",
      age: 19,
      email: "carlos.lopez@example.com",
      gender: "Male",
      enrollments: [
        { courseId: "1bb45ec6-2078-41fb-a2c0-adc814496b29", enrolledAt: "2025-05-01" },
        { courseId: "fb0a6168-614d-48c2-a871-d6b464aedf40", enrolledAt: "2025-05-02" },
        { courseId: "95a42c19-b8fe-47f1-a14c-9820a8865ac1", enrolledAt: "2025-05-03" },
      ],
    },
    {
      name: "Sofia Martinez",
      age: 20,
      email: "sofia.martinez@example.com",
      gender: "Female",
      enrollments: [
        { courseId: "fb0a6168-614d-48c2-a871-d6b464aedf40", enrolledAt: "2025-05-02" },
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
    // Entregas para Matemáticas
    {
      courseId: "1bb45ec6-2078-41fb-a2c0-adc814496b29",
      studentEmail: "laura.torres@example.com",
      fileUrl: "https://drive.google.com/file/d/matematicas_laura_ejercicios1",
      comments: "Resolución de ejercicios de álgebra - Primera entrega",
      grade: 4.2,
      submittedAt: "2025-05-10T12:00:00Z",
    },
    {
      courseId: "1bb45ec6-2078-41fb-a2c0-adc814496b29",
      studentEmail: "miguel.fernandez@example.com",
      fileUrl: "https://drive.google.com/file/d/matematicas_miguel_geometria",
      comments: "Trabajo de geometría euclidiana",
      grade: 3.8,
      submittedAt: "2025-05-12T09:30:00Z",
    },
    {
      courseId: "1bb45ec6-2078-41fb-a2c0-adc814496b29",
      studentEmail: "carlos.lopez@example.com",
      fileUrl: "https://drive.google.com/file/d/matematicas_carlos_trigonometria",
      comments: "Ejercicios de trigonometría",
      submittedAt: "2025-05-11T14:20:00Z", // Sin calificar aún
    },

    // Entregas para Historia
    {
      courseId: "fb0a6168-614d-48c2-a871-d6b464aedf40",
      studentEmail: "miguel.fernandez@example.com",
      fileUrl: "https://drive.google.com/file/d/historia_miguel_revolucion",
      comments: "Ensayo sobre la Revolución Francesa y sus consecuencias",
      grade: 4.5,
      submittedAt: "2025-05-12T16:00:00Z",
    },
    {
      courseId: "fb0a6168-614d-48c2-a871-d6b464aedf40",
      studentEmail: "carlos.lopez@example.com",
      fileUrl: "https://drive.google.com/file/d/historia_carlos_roma",
      comments: "Análisis del Imperio Romano",
      grade: 4.0,
      submittedAt: "2025-05-13T11:15:00Z",
    },
    {
      courseId: "fb0a6168-614d-48c2-a871-d6b464aedf40",
      studentEmail: "sofia.martinez@example.com",
      fileUrl: "https://drive.google.com/file/d/historia_sofia_egipto",
      comments: "Investigación sobre el Antiguo Egipto",
      submittedAt: "2025-05-14T10:00:00Z", // Sin calificar
    },

    // Entregas para Programación
    {
      courseId: "95a42c19-b8fe-47f1-a14c-9820a8865ac1",
      studentEmail: "ana.ruiz@example.com",
      fileUrl: "https://github.com/ana-ruiz/python-ejercicios-1",
      comments: "Ejercicios básicos de Python - Variables y estructuras de control",
      grade: 4.7,
      submittedAt: "2025-05-15T09:30:00Z",
    },
    {
      courseId: "95a42c19-b8fe-47f1-a14c-9820a8865ac1",
      studentEmail: "laura.torres@example.com",
      fileUrl: "https://github.com/laura-torres/calculadora-python",
      comments: "Proyecto: Calculadora básica en Python",
      grade: 4.3,
      submittedAt: "2025-05-16T13:45:00Z",
    },
    {
      courseId: "95a42c19-b8fe-47f1-a14c-9820a8865ac1",
      studentEmail: "carlos.lopez@example.com",
      fileUrl: "https://github.com/carlos-lopez/algoritmos-basicos",
      comments: "Implementación de algoritmos de ordenamiento",
      submittedAt: "2025-05-17T08:20:00Z", // Sin calificar
    },
    {
      courseId: "95a42c19-b8fe-47f1-a14c-9820a8865ac1",
      studentEmail: "sofia.martinez@example.com",
      fileUrl: "https://github.com/sofia-martinez/juego-adivinanza",
      comments: "Juego de adivinanza de números en Python",
      grade: 4.1,
      submittedAt: "2025-05-18T15:10:00Z",
    },
  ],
};