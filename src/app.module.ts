import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { EmailService } from './email/email.service';


@Module({

  controllers: [ UsersController],
  providers: [UsersService, EmailService]

  //controllers: [AppController, UsersController],
  //providers: [AppService],
})
export class AppModule {}
