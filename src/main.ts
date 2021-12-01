import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  axios.defaults.withCredentials = true;
  app.use(cookieParser());
  // await app.useGlobalPipes(new ValidationPipe({}))
  app.enableCors({ credentials: true, origin: '*' });
  await app.listen(5000);
}
bootstrap();
