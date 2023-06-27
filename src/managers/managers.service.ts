import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../core';
import { Manager } from '@prisma/client';
import { CreateManagersDto } from './dto';

@Injectable()
export class ManagersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getManagersList(): Promise<Manager[]> {
    return this.prismaService.manager.findMany();
  }

  async getManagerById(managerId: string): Promise<Manager> {
    return this.prismaService.manager.findFirst({
      where: { id: managerId },
    });
  }

  async getManagerByEmail(email: string): Promise<Manager> {
    return this.prismaService.manager.findFirst({
      where: { email },
    });
  }

  async createManager(manager: CreateManagersDto): Promise<Manager> {
    if (await this.getManagerByEmail(manager.email.toLowerCase())) {
      throw new HttpException(
        'Email is already in use.',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return this.prismaService.manager.create({
        data: {
          name: manager.name,
          surname: manager.surname,
          email: manager.email.toLowerCase(),
        },
      });
    }
  }
}
