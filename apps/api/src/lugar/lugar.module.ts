import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lugar } from './lugar.entity';
import { LugarService } from './lugar.service';
import { LugarController } from './lugar.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lugar])],
  providers: [LugarService],
  controllers: [LugarController],
  exports: [LugarService],
})
export class LugarModule {}
