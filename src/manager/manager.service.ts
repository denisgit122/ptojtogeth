import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PasswordService, PrismaService } from '../core';
import { CreateManagerDto, UpdateManagerDto } from './dto';
import { IManager } from './interface';
import { isEmail } from 'class-validator';
import { EStatus, OrderService } from '../order';
import { User } from '@prisma/client';

@Injectable()
export class ManagerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly orderService: OrderService,
  ) {}

  async getManagersList(): Promise<IManager[]> {
    return this.prismaService.user.findMany({
      where: { role: 'manager' },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        status: true,
        is_active: true,
        last_login: true,
      },
    });
  }

  async getManagerById(id: string): Promise<IManager> {
    return this.prismaService.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        last_login: true,
        status: true,
        is_active: true,
      },
    });
  }

  async getManagerByIdOrEmail(identifier: string): Promise<User | null> {
    let manager: User | null = null;

    if (isEmail(identifier)) {
      manager = await this.prismaService.user.findFirst({
        where: {
          email: identifier,
        },
      });
    } else {
      manager = await this.prismaService.user.findFirst({
        where: {
          id: identifier,
        },
      });
    }

    return manager;
  }

  async createManager(manager: CreateManagerDto): Promise<IManager> {
    if (await this.getManagerByIdOrEmail(manager.email)) {
      throw new HttpException(
        'Email is already in use.',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return this.prismaService.user.create({
        data: {
          name: manager.name,
          surname: manager.surname,
          email: manager.email.toLowerCase(),
        },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          last_login: true,
          status: true,
          is_active: true,
        },
      });
    }
  }

  async updateManager(
    managerId: string,
    managerData: UpdateManagerDto,
  ): Promise<IManager> {
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
    };

    if (password) {
      updateData.password = password;
    }

    return this.prismaService.user.update({
      where: { id: managerId },
      data: updateData,
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        last_login: true,
        status: true,
        is_active: true,
      },
    });
  }

  async getStatisticOnManager(managerId: string) {
    const manager = await this.getManagerByIdOrEmail(managerId);

    if (!manager) {
      throw new HttpException('Manager not found', HttpStatus.NOT_FOUND);
    }

    const ordersWithManager = await this.orderService.countOrders({
      managerId: manager.id,
    });
    const inWorkOrdersWithManager = await this.orderService.countOrders({
      managerId: manager.id,
      status: EStatus.IN_WORK,
    });
    const dubbingOrdersWithManager = await this.orderService.countOrders({
      managerId: manager.id,
      status: EStatus.DUBBING,
    });
    const agreeOrdersWithManager = await this.orderService.countOrders({
      managerId: manager.id,
      status: EStatus.AGREE,
    });
    const disagreeOrdersWithManager = await this.orderService.countOrders({
      managerId: manager.id,
      status: EStatus.DISAGREE,
    });

    return {
      total: ordersWithManager,
      inWork: inWorkOrdersWithManager,
      agree: agreeOrdersWithManager,
      disagree: disagreeOrdersWithManager,
      dubbing: dubbingOrdersWithManager,
    };
  }
}
