import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';

import { UsersService } from './users/users.service';
import { EmailService } from './email/email.service';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';


@Module({
  imports: [UsersModule, EmailModule],
  controllers: [AppController],
  providers: [],


  //controllers: [AppController, UsersController],
  //providers: [AppService],
})
export class AppModule {}
