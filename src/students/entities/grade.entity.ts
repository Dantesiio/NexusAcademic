import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Student } from "./student.entity";

@Entity()
export class Grade {
    @ApiProperty({
        description: 'Identificador único de la calificación',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ApiProperty({
        description: 'Materia asociada a la calificación',
        example: 'Matemáticas',
    })
    @Column('text')
    subject: string;

    @ApiProperty({
        description: 'Valor de la calificación para la materia',
        example: 95,
    })
    @Column('text')
    grade: number;

    @ApiProperty({
        description: 'Estudiante asociado a la calificación',
        type: () => Student,
    })
    @ManyToOne(
      () => Student,
      (student) => student.grades,
      { onDelete: 'CASCADE' }
    )
    student?: Student;
}