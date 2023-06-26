import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Comment, Group, Order } from '@prisma/client';
import { PrismaService } from '../core';
import { PaginateQuery } from 'nestjs-paginate';
import { UpdateOrdersDto } from './dto';
import { OrdersEntity } from './orders.entity';
import {
  EStatus,
  IComment,
  ICustomPaginated,
  IGroup,
  IStatistic,
} from './interface';
import * as moment from 'moment';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getOrdersList(
    query?: PaginateQuery,
  ): Promise<ICustomPaginated<OrdersEntity>> {
    const { page = 1, limit = 25, sortBy = [['id', 'desc']], filter } = query;

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
        let startDate;
        let endDate;

        if (key === 'start_date') {
          startDate = Array.isArray(value) ? moment(value[0]) : moment(value);
        } else if (key === 'end_date') {
          endDate = Array.isArray(value) ? moment(value[0]) : moment(value);
        }

        if (startDate) {
          where['created_at'] = where['created_at'] || {};
          where['created_at'].gte = startDate.toISOString();
        }

        if (endDate) {
          where['created_at'] = where['created_at'] || {};
          where['created_at'].lte = endDate.toISOString();
        }

        if (
          key === 'name' ||
          key === 'surname' ||
          key === 'email' ||
          key === 'phone'
        ) {
          where[key] = { contains: value, mode: 'insensitive' };
        }

        if (
          key === 'course' ||
          key === 'course_type' ||
          key === 'course_format' ||
          key === 'status' ||
          key === 'group' ||
          key === 'manager'
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

    const totalCount = await this.countOrders();
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

  async getOrderByEmail(email: string): Promise<Order> {
    return this.prismaService.order.findFirst({
      where: { email },
    });
  }

  async editOrderById(orderId: string, orderData: UpdateOrdersDto) {
    const order = await this.getOrderById(orderId);
    let group;

    if (orderData.group) {
      group = await this.checkGroup(orderData.group);
    }

    if (order && order.manager === null) {
      const updateData: UpdateOrdersDto = {
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
        manager: orderData.manager,
      };

      if (group) {
        updateData.group = group.name;
      }

      return this.prismaService.order.update({
        where: { id: orderId },
        data: updateData,
      });
    }
  }

  async addComment(
    orderId: string,
    data: IComment,
    user: any,
  ): Promise<Comment | HttpException> {
    const order = await this.checkOrder(orderId);

    if (
      order &&
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
    return new HttpException('You can not add comment', HttpStatus.BAD_REQUEST);
  }

  async checkOrder(orderId: string): Promise<Order> {
    const order = await this.getOrderById(orderId);

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return order;
  }

  async createGroup(newGroup: IGroup): Promise<Group> {
    const group = await this.checkGroup(newGroup.name);

    if (!group) {
      return this.prismaService.group.create({
        data: {
          name: newGroup.name,
        },
      });
    }

    return group;
  }

  async checkGroup(nameGroup: string): Promise<Group> {
    const group = await this.prismaService.group.findFirst({
      where: { name: nameGroup },
    });

    if (!group) {
      return null;
    }

    return group;
  }

  async getCommentsFromOrderById(orderId: string): Promise<Comment[]> {
    return this.prismaService.comment.findMany({
      where: { orderId },
    });
  }

  async getGroups(): Promise<Group[]> {
    return this.prismaService.group.findMany();
  }

  async countOrders(argument?: Partial<OrdersEntity>): Promise<number> {
    const where: any = argument ? { ...argument } : {};

    return this.prismaService.order.count({ where });
  }

  async getStatisticOnOrders(): Promise<IStatistic> {
    const total = await this.countOrders();
    const inWork = await this.countOrders({ status: EStatus.IN_WORK });
    const nullOrders = await this.countOrders({ status: null });
    const agree = await this.countOrders({ status: EStatus.AGREE });
    const disagree = await this.countOrders({ status: EStatus.DISAGREE });
    const dubbing = await this.countOrders({ status: EStatus.DUBBING });
    const newOrders = await this.countOrders({ status: EStatus.NEW });

    return {
      total,
      inWork,
      null: nullOrders,
      agree,
      disagree,
      dubbing,
      new: newOrders,
    };
  }
}
