import { Injectable } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { initialData } from './data/seed-data';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class SeedService {

  constructor(private readonly studentService: StudentsService){}


async runSeed() {
    await this.insertNewStudents();
    return 'SEED EXECUTED';
  }

async insertNewStudents(){
  await this.studentService.deleteAllStudents();

  const students = initialData.students;

  const insertPromises: Promise<Student | undefined>[] = [];

  students.forEach(student => {
    insertPromises.push(this.studentService.create(student))
  });

  await Promise.all(insertPromises);

  return true;
}

}
