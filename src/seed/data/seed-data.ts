import { Enrollment } from "src/students/entities/enrollment.entity";

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
  students: SeedStudent[];
}

export const initialData: SeedData = {
  students: [
    {
      name: "Gus",
      age: 33,
      email: "gus@gmail.com",
      gender: "Male",
      enrollments: [
        {
          courseId: "<REPLACE_WITH_COURSE_UUID>",
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
          courseId: "<REPLACE_WITH_COURSE_UUID>",
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
          courseId: "<REPLACE_WITH_COURSE_UUID>",
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
          courseId: "<REPLACE_WITH_COURSE_UUID>",
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
          courseId: "<REPLACE_WITH_COURSE_UUID>",
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
          courseId: "<REPLACE_WITH_COURSE_UUID>",
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
          courseId: "<REPLACE_WITH_COURSE_UUID>",
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
          courseId: "<REPLACE_WITH_COURSE_UUID>",
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
          courseId: "<REPLACE_WITH_COURSE_UUID>",
          enrolledAt: "2025-05-17",
          score: 4.2,
        }
      ],
    },
  ],
};
