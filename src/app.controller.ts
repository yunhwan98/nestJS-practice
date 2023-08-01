import { Controller, Get } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
@Controller()
export class AppController{

    @Get()
    getHello(): string{
        return process.env.DATABASE_HOST;
    }


}
