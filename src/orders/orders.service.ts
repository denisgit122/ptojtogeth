import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from '../core';
import { PaginateQuery } from 'nestjs-paginate';
import { UpdateOrdersDto } from './dto';
import { OrdersEntity } from './orders.entity';
import { EStatus, IComment, ICustomPaginated } from './interface';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin';
import { ObjectId } from 'mongodb';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {}

  async getOrdersList(
    query: PaginateQuery,
  ): Promise<ICustomPaginated<OrdersEntity>> {
    const { page = 1, limit = 25, sortBy = [['id', 'DESC']], filter } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy =
      sortBy &&
      sortBy.map(([column, order]) => ({
        [column]: order === 'asc' ? 'asc' : 'desc',
      }));

    const where = {};
    if (filter && Object.keys(filter).length > 0) {
      Object.entries(filter).forEach(([key, value]) => {
        if (key === 'start_date') {
          if (Array.isArray(value)) {
            where['$or'] = value.map((dateStr) => ({
              created_at: { gte: new Date(dateStr) },
            }));
          } else {
            where['created_at'] = { gte: new Date(value) };
          }
        }

        if (key === 'end_date') {
          if (Array.isArray(value)) {
            where['$or'] = value.map((dateStr) => ({
              created_at: { lte: new Date(dateStr) },
            }));
          } else {
            where['created_at'] = { lte: new Date(value) };
          }
        }

        if (
          key === 'name' ||
          key === 'surname' ||
          key === 'email' ||
          key === 'phone'
        ) {
          where[key] = { contains: value };
        }

        if (
          key === 'course' ||
          key === 'course_type' ||
          key === 'course_format' ||
          key === 'status'
        ) {
          where[key] = { equals: value };
        }

        if (key === 'age') {
          if (Array.isArray(value)) {
            const ages = value.map((ageStr) => parseInt(ageStr, 10));
            where[key] = {
              in: ages,
            };
          } else {
            const age = parseInt(value, 10);
            where[key] = {
              equals: age,
            };
          }
        }
      });
    }

    const totalCount = await this.prismaService.order.count();
    const orders = await this.prismaService.order.findMany({
      skip,
      take,
      orderBy,
      where,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: orders,
      page,
      limit,
      totalCount,
      totalPages,
    };
  }

  async getOrderById(orderId: string): Promise<Order> {
    return this.prismaService.order.findFirst({
      where: { id: orderId },
    });
  }

  async editOrderById(orderId: string, orderData: UpdateOrdersDto) {
    const order = await this.getOrderById(orderId);

    if (order.manager === null) {
      return this.prismaService.order.update({
        where: { id: orderId },
        data: {
          name: orderData.name,
          surname: orderData.surname,
          email: orderData.email,
          phone: orderData.phone,
          age: orderData.age,
          course: orderData.course,
          course_type: orderData.course_type,
          course_format: orderData.course_format,
          status: orderData.status,
          sum: orderData.sum,
          already_paid: orderData.already_paid,
          group: orderData.group,
          manager: orderData.manager,
        },
      });
    }
  }

  async addComment(orderId: string, data: IComment, user: any) {
    const order = await this.checkOrder(orderId);

    if (
      order.manager === null &&
      (order.status === EStatus.NEW || order.status === null)
    ) {
      const comment = data.comment;

      await this.editOrderById(orderId, {
        manager: user.name,
        status: EStatus.IN_WORK,
      });

      return this.prismaService.comment.create({
        data: {
          text: comment,
          orderId: order.id,
          author: `${user.name} ${user.surname}`,
          created_at: new Date(),
        },
      });
    }
    return null;
  }

  async checkOrder(orderId: string): Promise<Order> {
    const order = await this.getOrderById(orderId);

    if (!order) {
      return null;
    }

    return order;
  }
}
