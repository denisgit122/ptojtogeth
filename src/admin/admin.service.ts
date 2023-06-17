import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../core';
import { Admin } from '@prisma/client';
import * as process from 'process';
import { isEmail } from 'class-validator';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkAdminExistence(): Promise<boolean> {
    const adminCount = await this.prismaService.admin.count();

    return adminCount > 0;
  }

  async getAdminByIdOrEmail(identifier: string): Promise<Admin | null> {
    let admin: Admin | null = null;

    if (isEmail(identifier)) {
      admin = await this.prismaService.admin.findFirst({
        where: {
          email: identifier,
        },
      });
    } else {
      admin = await this.prismaService.admin.findFirst({
        where: {
          id: identifier,
        },
      });
    }

    return admin;
  }

  async createAdmin(
    email: string,
    password: string,
    name: string,
    surname: string,
  ): Promise<Admin> {
    const passwordHash = await this.hashPassword(password);

    return this.prismaService.admin.create({
      data: {
        email,
        password: passwordHash,
        name,
        surname,
      },
    });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = parseInt(process.env.SALT, 10);

    return bcrypt.hash(password, salt);
  }
}
