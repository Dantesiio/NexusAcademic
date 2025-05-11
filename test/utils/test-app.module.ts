import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
      envFilePath: '.env.test',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Es seguro usar true en pruebas
      }),
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