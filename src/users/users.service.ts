import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as uuid from 'uuid'
import { EmailService } from 'src/email/email.service';


@Injectable()
export class UsersService {
  
  constructor(private emailService: EmailService){}

  async createUser(name: string, email: string, password:string){


    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1()

    
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email,signupVerifyToken)

  }

  //유저 존재 검사
  private checkUserExists(email: string){
    return false; //TODO: DB 연동 후 구현
  }

  //유저를 DB에 저장
  private saveUser(name: string, email: string, password: string, signupVerifyToken: string){
    return; //TODO: DB 연동 후 구현
  }

  
  //회원 가입 인증 이메일 발송
  private async sendMemberJoinEmail(email: string, signupVerifyToken: string){
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string>{

    //TODO
    //1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없담면 에러 처리
    //2. 바로 로그인 상태가 되도록 jwt 발금

    throw new Error("Method not implemented.")


  }


  

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
