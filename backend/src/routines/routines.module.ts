import { Module } from '@nestjs/common';
import { RoutinesController } from './routines.controller';
import { RoutinesService } from './routines.service';
import { RoutinesEntity } from './entities/routines.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RoutinesEntity]), ],
  controllers: [RoutinesController],
  providers: [RoutinesService],
  exports:[TypeOrmModule,RoutinesService]
})
export class RoutinesModule {}
