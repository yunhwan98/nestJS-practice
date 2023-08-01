import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailService } from 'src/email/email.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [EmailModule,
        TypeOrmModule.forFeature([UserEntity]),
        AuthModule
    ],
    controllers:[UsersController],
    providers: [UsersService]

})
export class UsersModule {}
