import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
import * as path from "path";
import { ValidationPipe } from '@nestjs/common';


//dotenv 환경설정
dotenv.config({
  path: path.resolve(
    (process.env.NODE_ENV === 'production') 
    ? '.production.env'
    : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
  )
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //validationPipe를 전역으로 사용
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }))


  await app.listen(3000);
}
bootstrap();
