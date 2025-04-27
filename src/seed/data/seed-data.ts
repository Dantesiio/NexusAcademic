import { Grade } from "src/students/entities/grade.entity";

interface SeedStudent{

        name:string;
        age: number;
        email: string;
        subjects: string[];
        gender: 'Male' | 'Female' | 'Other';
        nickname?:string;
        grades: Grade[];
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
            subjects: ["math", "P.E"],
            gender: "Male",
            grades: [
                {
                    subject: "P.E",
                    grade: 4.2
                },
                {
                    subject: "Math",
                    grade: 4.2 
                }
            ]
        },
        {
            name: "Valentina",
            age: 21,
            email: "valentina@gmail.com",
            subjects: ["math", "P.E"],
            gender: "Female",
            grades: [
                {
                    subject: "P.E",
                    grade: 4.2
                },
                {
                    subject: "Math",
                    grade: 4.2 
                }
            ]
        },
        {
            name: "Alejandro",
            age: 20,
            email: "alejandro@gmail.com",
            subjects: ["math", "P.E"],
            gender: "Male",
            grades: [
                {
                    subject: "P.E",
                    grade: 4.2
                },
                {
                    subject: "Math",
                    grade: 4.2 
                }
            ]
        },
        {
            name: "Daniela",
            age: 22,
            email: "daniela@gmail.com",
            subjects: ["math", "P.E"],
            gender: "Female",
            grades: [
                {
                    subject: "P.E",
                    grade: 4.2
                },
                {
                    subject: "Math",
                    grade: 4.2 
                }
            ]
        },
        {
            name: "Samuel",
            age: 23,
            email: "samuel@gmail.com",
            subjects: ["math", "P.E"],
            gender: "Male",
            grades: [
                {
                    subject: "P.E",
                    grade: 4.2
                },
                {
                    subject: "Math",
                    grade: 4.2 
                }
            ]
        },
        {
            name: "Isabella",
            age: 20,
            email: "isabella@gmail.com",
            subjects: ["math", "P.E"],
            gender: "Female",
            grades: [
                {
                    subject: "P.E",
                    grade: 4.2
                },
                {
                    subject: "Math",
                    grade: 4.2 
                }
            ]
        },
        {
            name: "Jonathan",
            age: 21,
            email: "jonathan@gmail.com",
            subjects: ["math", "P.E"],
            gender: "Male",
            grades: [
                {
                    subject: "P.E",
                    grade: 4.2
                },
                {
                    subject: "Math",
                    grade: 4.2 
                }
            ]
        },
        {
            name: "Leidy",
            age: 22,
            email: "leidy@gmail.com",
            subjects: ["math", "P.E"],
            gender: "Female",
            grades: [
                {
                    subject: "P.E",
                    grade: 4.2
                },
                {
                    subject: "Math",
                    grade: 4.2 
                }
            ]
        },
        {
            name: "Miguel",
            age: 20,
            email: "miguel@gmail.com",
            subjects: ["math", "P.E"],
            gender: "Male",
            grades: [
                {
                    subject: "P.E",
                    grade: 4.2
                },
                {
                    subject: "Math",
                    grade: 4.2 
                }
            ]
        },

    ]
}
