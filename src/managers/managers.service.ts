import { Injectable } from '@nestjs/common';
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

  async createManager(manager: CreateManagersDto): Promise<Manager> {
    return this.prismaService.manager.create({
      data: {
        name: manager.name,
        surname: manager.surname,
        email: manager.email,
      },
    });
  }
}
