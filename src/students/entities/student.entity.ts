import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Grade } from "./grade.entity";

@Entity()
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text')
    name:string;

    @Column({
        type:'int',
        nullable: true
    })
    age: number;

    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    @Column({
        type: 'text',
        array: true
    })
    subjects: string[];

    @Column('text')
    gender: string;

    @Column('text', {
        unique:true,
        nullable: true
    })
    nickname?: string

    @OneToMany(
        () => Grade,
        (grade) => grade.student,
        {cascade:true, eager: true}
    )
    grades?: Grade[]

    @BeforeInsert()
    checkNicknameInsert(){
        if(!this.nickname){
            this.nickname = this.name;
          }
    
          this.nickname = this.nickname
                                        .toLowerCase()
                                        .replaceAll(" ", "_")
                                        +this.age;
    }
    
    @BeforeUpdate()
    checkNickNameUpdate(){
        this.nickname = this.nickname!
                                        .toLowerCase()
                                        .replaceAll(" ", "_")
                                        +this.age;
    }
}
