import Mail =require('nodemailer/lib/mailer')
import * as nodemailer from 'nodemailer'

import { Injectable } from '@nestjs/common';

//메일 옵션 타입
interface EmailOptions{
    to: string;
    subject: string;
    html: string;
}


@Injectable()
export class EmailService {
    private transporter: Mail;


    constructor(){
        //transporter 객체 생성
        this.transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "yunhwan980107@gmail.com",
                pass: "cakslzsalhyqxyey",
            }
        })
    }

    async sendMemberJoinVerification(emailAddress: string, signupVerifyToken:string){
        const baseUrl = 'http://localhost:3000';

        //유저가 누를 버튼의 링크
        const url =`${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

        const mailOptions: EmailOptions={
            to:emailAddress,
            subject: '가입 인증 메일',


            //메일 본문 구성
            html:`
                가입확인 버튼을 누르시면 가입 인증이 완료됩니다.<br/>
                <form action="${url}" method="POST">
                    <button>가입확인</button>
                </form>
            `
            
        }

        //transporter를 이용한 메일 전송
        return await this.transporter.sendMail(mailOptions);


    }


}






