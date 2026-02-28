import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
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

  // 等前端開發完成後再設定 CORS，現在先不開放跨域請求，免得到時忘了設置
  // app.enableCors({
  //   origin: [''],
  //   Credential: true,
  // });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 剃除 DTO 裡沒有定義的屬性（安全防護）
      // forbidNonWhitelisted: true, // 如果傳了未定義的屬性，直接報錯，而不是默默剃除
      transform: true, // 自動將輸入資料轉成 DTO class 的實例（自動轉型）
    }),
  );

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerDocumentConfig);
  SwaggerModule.setup('swagger', app, documentFactory());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
