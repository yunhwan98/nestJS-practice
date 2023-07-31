import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as uuid from 'uuid'
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { UserEntity } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';



@Injectable()
export class UsersService {
  
  constructor(private emailService: EmailService,

        //유저 저장소 주입
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    
    ){}

  async createUser(name: string, email: string, password:string){

    //기존 유저 정보 확인
    const userExists = await this.checkUserExists(email);
    if(userExists){
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.')
    }

    const signupVerifyToken = uuid.v1()

    
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email,signupVerifyToken)

  }

  //유저 존재 검사
  private async checkUserExists(emailAddress: string):Promise<boolean>{

    const user = await this.userRepository.findOne({
      where: {email: emailAddress}
    })

    return user !== undefined;
  }

  //유저를 DB에 저장
  private async saveUser(name: string, email:string,password: string, signupVerifyToken: string){
    const user =new UserEntity();
    user.id =ulid();
    user.name=name;
    user.email=email;
    user.password=password;
    user.signupVerifyToken=signupVerifyToken;
    await this.userRepository.save(user);

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

  async login(email: string, password: string):Promise<string>{

    //TODO
    //1. email, pw를 가진 유저가 존재하는지 DB에서 확인 후 없다면 에러 처리
    //2. jwt 발급

    throw new Error("Method not implemented.")

  }


  async getUserInfo(userId: string):Promise<UserInfo>{


    //TODO
    //1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    //2. 조회된 데이터를 UserInfo 타입으로 응답

    throw new Error('Method not implemented.');

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
