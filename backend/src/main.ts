import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Всі запити будуть починатися з /api
  app.setGlobalPrefix('api');
  app.enableCors();
  // Слухаємо на 0.0.0.0, щоб внутрішня Docker мережа могла достукатись
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
