import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Manager } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendManagerActivate(manager: Manager, token: string) {
    const url = `${process.env.FRONT_URL}/activate?token=${token}`;

    await this.mailerService.sendMail({
      to: manager.email,
      subject: 'Welcome to Nice App! Activate your account!',
      template: 'activate',
      context: {
        name: manager.name,
        url,
      },
    });
  }
}
