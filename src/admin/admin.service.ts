import { Injectable } from '@nestjs/common';
import { PasswordService, PrismaService } from '../core';
import { User } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async checkAdminExistence(): Promise<boolean> {
    const adminCount = await this.prismaService.user.count({
      where: { role: 'admin' },
    });

    return adminCount > 0;
  }

  async createAdmin(
    email: string,
    password: string,
    name: string,
    surname: string,
  ): Promise<User> {
    const passwordHash = await this.passwordService.hashPassword(password);

    return this.prismaService.user.create({
      data: {
        email,
        password: passwordHash,
        name,
        surname,
        role: 'admin',
        is_active: true,
      },
    });
  }
}
