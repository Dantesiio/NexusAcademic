import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { CommonsModule } from './commons/commons.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'ep-fragrant-unit-a4takj03-pooler.us-east-1.aws.neon.tech',
  port: 5432,
  username: 'neondb_owner',
  password: 'npg_e2dfKhxH5UNV',
  database: 'neondb',
  autoLoadEntities: true,
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
}),

    StudentsModule,
    CommonsModule,
    SeedModule,
    AuthModule,
    CoursesModule,
    SubmissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
