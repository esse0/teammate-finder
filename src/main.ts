import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as fs from 'node:fs';


async function bootstrap() {
  const PORT = process.env.PORT || 3000;

  const httpsOptions = {
    key: fs.readFileSync('./secrets/key.pem'),
    cert: fs.readFileSync('./secrets/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.use(cookieParser());
  app.enableShutdownHooks();

  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}
bootstrap();
