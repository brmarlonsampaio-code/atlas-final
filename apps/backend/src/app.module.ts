import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LugarModule } from './lugar/lugar.module';
import { SearchModule } from './search/search.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { EntitiesModule } from './entities/entities.module';
import { AiModule } from './ai/ai.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    EntitiesModule,
    LugarModule,
    SearchModule,
    AiModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
