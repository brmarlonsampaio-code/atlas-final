import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DbModule } from './db/db.module';
import { EntitiesModule } from './entities/entities.module';
import { RoutesModule } from './routes/routes.module';
import { CategoriesModule } from './categories/categories.module';
import { AiModule } from './ai/ai.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Limite geral (evita abuso da API pública) + limite mais apertado
    // aplicado manualmente nas rotas de admin (ver admin.controller.ts).
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    DbModule,
    EntitiesModule,
    RoutesModule,
    CategoriesModule,
    SearchModule,
    AiModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
