import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Grade } from "./grade.entity";

@Entity()
export class Student {
    @ApiProperty({
        description: 'Identificador único del estudiante',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Nombre del estudiante',
        example: 'Juan Pérez',
    })
    @Column('text')
    name: string;

    @ApiProperty({
        description: 'Edad del estudiante',
        example: 20,
        nullable: true,
    })
    @Column({
        type: 'int',
        nullable: true,
    })
    age: number;

    @ApiProperty({
        description: 'Correo electrónico único del estudiante',
        example: 'juan.perez@example.com',
    })
    @Column({
        type: 'text',
        unique: true,
    })
    email: string;

    @ApiProperty({
        description: 'Lista de materias asociadas al estudiante',
        example: ['Matemáticas', 'Historia', 'Ciencias'],
    })
    @Column({
        type: 'text',
        array: true,
    })
    subjects: string[];

    @ApiProperty({
        description: 'Género del estudiante',
        example: 'Masculino',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        description: 'Apodo único del estudiante',
        example: 'juan_perez20',
        nullable: true,
    })
    @Column('text', {
        unique: true,
        nullable: true,
    })
    nickname?: string;

    @ApiProperty({
        description: 'Lista de calificaciones asociadas al estudiante',
        type: () => [Grade],
    })
    @OneToMany(
      () => Grade,
      (grade) => grade.student,
      { cascade: true, eager: true },
    )
    grades?: Grade[];

    @BeforeInsert()
    checkNicknameInsert() {
        if (!this.nickname) {
            this.nickname = this.name;
        }

        this.nickname = this.nickname
            .toLowerCase()
            .replaceAll(" ", "_")
          + this.age;
    }

    @BeforeUpdate()
    checkNickNameUpdate() {
        this.nickname = this.nickname!
            .toLowerCase()
            .replaceAll(" ", "_")
          + this.age;
    }
}