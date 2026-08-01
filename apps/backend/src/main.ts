import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilitar CORS para comunicação com o Next.js
  app.enableCors();

  // Serve os arquivos anexados via painel admin (uploads/documents)
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Atlas Histórico Digital API')
    .setDescription('API Aberta para consulta de acervos, metadados e entidades espaciais')
    .setVersion('1.0')
    .addTag('lugares')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
