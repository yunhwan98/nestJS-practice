import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers,UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth.guard';




@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    //Authservice 주입
    private authservice: AuthService
    ) {}

  //회원 가입 요청
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const {name,email,password} = dto;
    await this.usersService.createUser(name,email,password);

  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const {signupVerifyToken} =dto
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {

    const {email, password} =dto;

    return await this.usersService.login(email,password);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserInfo(@Headers() headers:any, @Param('id') userId: string): Promise<UserInfo> {

    //jwt 파싱
    const jwtString = headers.authorization.split(`Bearer `)[1]
    
    //검증
    this.authservice.verify(jwtString);

    //유저정보 반환
    return this.usersService.getUserInfo(userId);

  }



}
