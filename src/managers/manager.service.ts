import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PasswordService, PrismaService } from "../core";
import {Manager} from '@prisma/client';
import {CreateManagerDto, UpdateManagerDto} from './dto';
import {isEmail} from "class-validator";

@Injectable()
export class ManagerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async getManagersList(): Promise<Manager[]> {
    return this.prismaService.manager.findMany();
  }

  async getManagerByIdOrEmail(identifier: string): Promise<Manager | null> {
    let manager: Manager | null = null;

    if (isEmail(identifier)) {
      manager = await this.prismaService.manager.findFirst({
        where: {
          email: identifier,
        },
      });
    } else {
      manager = await this.prismaService.manager.findFirst({
        where: {
          id: identifier,
        },
      });
    }

    return manager;
  }

  async createManager(manager: CreateManagerDto): Promise<Manager> {
    if (await this.getManagerByIdOrEmail(manager.email)) {
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

  async updateManager(
    managerId: string,
    managerData: UpdateManagerDto,
  ): Promise<Manager> {
    let password;

    if (managerData.password) {
      password = await this.passwordService.hashPassword(managerData.password);
    }

    const updateData: UpdateManagerDto = {
      name: managerData.name,
      surname: managerData.surname,
      email: managerData.email,
      status: managerData.status,
      is_active: managerData.is_active,
      last_login: managerData.last_login,
    }

    if (password) {
      updateData.password = password;
    }

    return this.prismaService.manager.update({
      where: { id: managerId },
      data: updateData,
    });
  }
}
