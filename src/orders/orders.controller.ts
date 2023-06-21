import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AddCommentDto, CreateGroupDto, UpdateOrdersDto } from './dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthGuard } from '@nestjs/passport';
import { IComment, IGroup } from './interface';
import { User } from '../auth/user.decorator';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard('access'))
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
    example: 'name:desc',
    type: String,
    required: false,
    description: 'Sort by column and order',
  })
  @ApiQuery({
    name: 'filter.name',
    example: 'ax',
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
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: AddCommentDto })
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

  @ApiParam({ name: 'orderId', required: true })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Get(':orderId/comments')
  async getCommentsFromOrderById(
    @Req() req: any,
    @Res() res: any,
    @Param('orderId') orderId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.ordersService.getCommentsFromOrderById(orderId));
  }

  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateGroupDto })
  @Post('create/group')
  async createGroup(@Req() req: any, @Body() body: IGroup, @Res() res: any) {
    return res
      .status(HttpStatus.OK)
      .json(await this.ordersService.createGroup(body));
  }

  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Get('groups')
  async getGroups(@Req() req: any, @Res() res: any) {
    return res.status(HttpStatus.OK).json(await this.ordersService.getGroups());
  }
}
