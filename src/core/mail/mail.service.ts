import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Manager } from '@prisma/client';
import {EActionTokenType} from "../token";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendManagerActivate(manager: Manager, token: string): Promise<void> {
    const url = `${process.env.FRONT_URL}/activate?token=${token}`;

    await this.mailerService.sendMail({
      to: manager.email,
      subject: 'Welcome to Nice App! Activate your account!',
      template: EActionTokenType.activate,
      context: {
        name: manager.name,
        url,
      },
    });
  }

  async sendManagerForgotPassword(manager: Manager, token: string): Promise<void> {
    const url = `${process.env.FRONT_URL}/forgot/password?token=${token}`;

    await this.mailerService.sendMail({
      to: manager.email,
      subject: 'We control your password, just follow all steps and everything will be good.',
      template: EActionTokenType.forgot,
      context: {
        name: manager.name,
        url,
      },
    });
  }
}
