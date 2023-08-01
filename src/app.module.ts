import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import emailConfig from './config/emailConfig';


import { UsersModule } from './users/users.module';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import authConfig from './config/authConfig';


import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({      
      //절대 경로 설정
      envFilePath:[`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig,authConfig],
      isGlobal: true,
      //유효성 검사
      validationSchema,
    }),
    //TypeOrmModule 가져오기
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,//'localhost',
      port: 3306,
      username: process.env.DATABASE_USERNAME, //'root'
      password: process.env.DATABASE_PASSWORD,//'test',
      database: 'test',
      entities: [__dirname + `/**/*.entity{.ts,.js}`],

      //DB 스키마 동기화 여부(프로덕션에서는 false!)
      synchronize: process.env.DATABASE_SYNCRONIZE === 'true',
    }),
    AuthModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            //로그 시간 표시
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', { prettyPrint: true }),
          ),
        }),
      ],
    }),
  ],
  controllers: [],
  providers: [],


  //controllers: [AppController, UsersController],
  //providers: [AppService],
})
export class AppModule {}
