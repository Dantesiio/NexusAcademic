import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from '../../src/students/students.module';
import { CommonsModule } from '../../src/commons/commons.module';
import { SeedModule } from '../../src/seed/seed.module';
import { AuthModule } from '../../src/auth/auth.module';
import { CoursesModule } from '../../src/courses/courses.module';
import { SubmissionsModule } from '../../src/submissions/submissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,           
      username: 'postgres',
      password: 'postgres', // Debe coincidir con la contraseña del Docker
      database: 'prueba1_test',
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
    }),
    StudentsModule,
    CommonsModule,
    SeedModule,
    AuthModule,
    CoursesModule,
    SubmissionsModule,
  ],
})
export class TestAppModule {}