import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import emailConfig from './config/emailConfig';


import { UsersModule } from './users/users.module';
import { validationSchema } from './config/validationSchema';


@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      //절대 경로 설정
      envFilePath:[`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      //유효성 검사
      validationSchema,
    }),
  ],
  controllers: [],
  providers: [],


  //controllers: [AppController, UsersController],
  //providers: [AppService],
})
export class AppModule {}
