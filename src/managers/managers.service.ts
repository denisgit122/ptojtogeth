import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PasswordService, PrismaService } from "../core";
import { Manager } from '@prisma/client';
import { CreateManagersDto } from './dto';
import { AuthService } from '../auth';

@Injectable()
export class ManagersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

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
      where: { email: email.trim().toLowerCase() },
    });
  }

  async createManager(manager: CreateManagersDto): Promise<Manager> {
    if (await this.getManagerByEmail(manager.email)) {
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

  async updateActivateManager(
    managerId: string,
    password: string,
  ): Promise<Manager> {
    const hash = await this.passwordService.hashPassword(password);

    return this.prismaService.manager.update({
      where: { id: managerId },
      data: { password: hash, is_active: true },
    });
  }

  async updateLastLoginManager(
    managerId: string,
  ): Promise<Manager> {
    return this.prismaService.manager.update({
      where: { id: managerId },
      data: { last_login: new Date},
    });
  }
}
