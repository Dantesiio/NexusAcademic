import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity('users')
export class User {

    @ApiProperty({
        description: 'Identificador único del usuario',
        example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Correo electrónico único del usuario',
        example: 'test@example.com',
    })
    @Column('text', {
        unique: true
    })
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario (almacenada como hash)',
        example: 'hashed-password',
    })
    @Column('text')
    password?: string;

    @ApiProperty({
        description: 'Nombre completo del usuario',
        example: 'John Doe',
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        description: 'Indica si el usuario está activo',
        example: true,
        default: true,
    })
    @Column('bool', { default: true })
    isActive: boolean;

    @ApiProperty({
        description: 'Roles asignados al usuario',
        example: ['teacher', 'admin'],
        default: ['teacher'],
    })
    @Column('text', {
        array: true,
        default: ['teacher']
    })
    roles: string[];
}