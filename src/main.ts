import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
import * as path from "path";
import { ValidationPipe } from '@nestjs/common';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';


//dotenv 환경설정
dotenv.config({
  path: path.resolve(
    (process.env.NODE_ENV === 'production') 
    ? '.production.env'
    : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
  )
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', { prettyPrint: true }),
          ),
        }),
      ],
    })
  });
  
  //validationPipe를 전역으로 사용
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }))


  await app.listen(3000);
}
bootstrap();
