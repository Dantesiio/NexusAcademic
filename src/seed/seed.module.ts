import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { StudentsModule } from 'src/students/students.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [StudentsModule]
})
export class SeedModule {}
