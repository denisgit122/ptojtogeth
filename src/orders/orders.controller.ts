import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch, Post,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { OrdersService } from './orders.service';
import { UpdateOrdersDto } from './dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthGuard } from '@nestjs/passport';
import { IComment } from './interface';
import { User } from "../auth/user.decorator";

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard('bearer'))
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiQuery({
    name: 'page',
    type: Number,
    example: '4',
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    example: '10',
    type: Number,
    required: false,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'sortBy',
    example: 'name:DESC',
    type: String,
    required: false,
    description: 'Sort by column and order',
  })
  @ApiQuery({
    name: 'filter',
    example: ['filter.name=ax', 'filter.age=25'],
    type: String,
    required: false,
    description: 'Filter by value',
  })
  async getOrdersList(
    @Req() req: any,
    @Res() res: any,
    @Paginate() query: PaginateQuery,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.ordersService.getOrdersList(query));
  }

  @ApiParam({ name: 'orderId', required: true })
  @Get(':orderId')
  async getOrderById(
    @Req() req: any,
    @Res() res: any,
    @Param('orderId') orderId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.ordersService.getOrderById(orderId));
  }

  @ApiParam({ name: 'orderId', required: true })
  @Patch(':orderId')
  async editOrder(
    @Req() req: any,
    @Body() body: UpdateOrdersDto,
    @Res() res: any,
    @Param('orderId') orderId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.ordersService.editOrderById(orderId, body));
  }

  @ApiParam({ name: 'orderId', required: true })
  @Post(':orderId/comment')
  async addComment(
    @Req() req: any,
    @Body() body: IComment,
    @Res() res: any,
    @Param('orderId') orderId: string,
    @User() user: any,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.ordersService.addComment(orderId, body, user));
  }
}
