import { Enrollment } from "src/students/entities/enrollment.entity";

interface SeedEnrollment {
  courseId: string;
  enrolledAt: string;
  score?: number;
}

interface SeedCourse {
  id: string;
  name: string;
  description: string;
  code: string;
  startDate: string;
  endDate: string;
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
      name: "Gus",
      age: 33,
      email: "gus@gmail.com",
      gender: "Male",
      enrollments: [
        {
          courseId: "1bb45ec6-2078-41fb-a2c0-adc814496b29",
          enrolledAt: "2025-05-01",
          score: 4.2,
        }
      ],
    },
    {
      name: "Valentina",
      age: 21,
      email: "valentina@gmail.com",
      gender: "Female",
      enrollments: [
        {
          courseId: "fb0a6168-614d-48c2-a871-d6b464aedf40",
          enrolledAt: "2025-05-03",
          score: 4.2,
        }
      ],
    },
    {
      name: "Alejandro",
      age: 20,
      email: "alejandro@gmail.com",
      gender: "Male",
      enrollments: [
        {
          courseId: "95a42c19-b8fe-47f1-a14c-9820a8865ac1",
          enrolledAt: "2025-05-05",
          score: 4.2,
        }
      ],
    },
    {
      name: "Daniela",
      age: 22,
      email: "daniela@gmail.com",
      gender: "Female",
      enrollments: [
        {
          courseId: "1bb45ec6-2078-41fb-a2c0-adc814496b29",
          enrolledAt: "2025-05-07",
          score: 4.2,
        }
      ],
    },
    {
      name: "Samuel",
      age: 23,
      email: "samuel@gmail.com",
      gender: "Male",
      enrollments: [
        {
          courseId: "fb0a6168-614d-48c2-a871-d6b464aedf40",
          enrolledAt: "2025-05-09",
          score: 4.2,
        }
      ],
    },
    {
      name: "Isabella",
      age: 20,
      email: "isabella@gmail.com",
      gender: "Female",
      enrollments: [
        {
          courseId: "95a42c19-b8fe-47f1-a14c-9820a8865ac1",
          enrolledAt: "2025-05-11",
          score: 4.2,
        }
      ],
    },
    {
      name: "Jonathan",
      age: 21,
      email: "jonathan@gmail.com",
      gender: "Male",
      enrollments: [
        {
          courseId: "1bb45ec6-2078-41fb-a2c0-adc814496b29",
          enrolledAt: "2025-05-13",
          score: 4.2,
        }
      ],
    },
    {
      name: "Leidy",
      age: 22,
      email: "leidy@gmail.com",
      gender: "Female",
      enrollments: [
        {
          courseId: "fb0a6168-614d-48c2-a871-d6b464aedf40",
          enrolledAt: "2025-05-15",
          score: 4.2,
        }
      ],
    },
    {
      name: "Miguel",
      age: 20,
      email: "miguel@gmail.com",
      gender: "Male",
      enrollments: [
        {
          courseId: "95a42c19-b8fe-47f1-a14c-9820a8865ac1",
          enrolledAt: "2025-05-17",
          score: 4.2,
        }
      ],
    },
  ],
};
