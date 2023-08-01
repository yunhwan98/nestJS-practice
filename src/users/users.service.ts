import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { DataSource, Repository } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from './interface/UserInfo';
import { UserEntity } from './infra/db/entity/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';



@Injectable()
export class UsersService {
  
  constructor(private emailService: EmailService,

        //유저 저장소 주입
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private dataSource: DataSource,
        private authService: AuthService   
    ){}

  async createUser(name: string, email: string, password:string){

    //기존 유저 정보 확인
    const userExists = await this.checkUserExists(email);
    console.log(userExists)
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


    //가입 중인 유저 찾기
    const user =await this.userRepository.findOne({
      where: {signupVerifyToken}

    })

    //DB에 없으면 에러 생성
    if(!user){
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    //로그인 처리 요청
    return this.authService.login({
      id:user.id,
      name: user.name,
      email: user.email
    })
  


  }

  async login(email: string, password: string):Promise<string>{

    //TODO
    //1. email, pw를 가진 유저가 존재하는지 DB에서 확인 후 없다면 에러 처리
    //2. jwt 발급
    const user = await this.userRepository.findOne({
      where: { email, password }
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }


  async getUserInfo(userId: string):Promise<UserInfo>{


    //TODO
    //1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    //2. 조회된 데이터를 UserInfo 타입으로 응답

    const user = await this.userRepository.findOne({
      where: {id: userId}
    })


    console.log(user)
    if(!user){
      throw new NotFoundException('유저가 존재하지 않습니다.')

    }


    return {
      id: user.id,
      name: user.name,
      email: user.email
    }

  }



  private async saveUserUsingQueryRunner(name: string,email:string, password:string,signupVerifyToken:string){
    const queryRunner =this.dataSource.createQueryRunner()
    
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try{
      const user = new UserEntity();
      user.id =ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken =signupVerifyToken;

      //트랜잭션 커밋(영속화)
      await queryRunner.manager.save(user);

      //throw new InternalServerErrorException() //일부러 에러 발생
      
      await queryRunner.commitTransaction();
    }catch(e){
      //에러가 발생시 롤백
      await queryRunner.rollbackTransaction();
    }finally{
      //직접 생성한 QueryRunner는 해제
      await queryRunner.release();
    }



  }

  


}
