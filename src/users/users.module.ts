import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailService } from 'src/email/email.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
    imports: [EmailModule,
        TypeOrmModule.forFeature([UserEntity])
    ],
    controllers:[UsersController],
    providers: [UsersService]

})
export class UsersModule {}
