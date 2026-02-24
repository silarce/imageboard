import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const swaggerDocumentConfig = new DocumentBuilder()
  .setTitle('image board api')
  .setDescription('這是貼圖版的api文件')
  .setVersion('1.0')
  .addTag('貼圖版')
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerDocumentConfig);
  SwaggerModule.setup('swagger', app, documentFactory());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
