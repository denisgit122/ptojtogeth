import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
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
import { ManagerService } from './manager.service';
import { CreateManagerDto, UpdateManagerDto } from './dto';
import { TrimPipe } from '../core';
import { AdminAuthGuard } from '../admin';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.decorator';

@ApiTags('Managers')
@Controller('managers')
@UseGuards(AuthGuard('access'))
@ApiBearerAuth()
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseGuards(AdminAuthGuard)
  async getManagersList(@Req() req: any, @Res() res: any) {
    return res
      .status(HttpStatus.OK)
      .json(await this.managerService.getManagersList());
  }

  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateManagerDto })
  @UseGuards(AdminAuthGuard)
  @Post('create')
  async createManager(
    @Req() req: any,
    @Res() res: any,
    @Body(new TrimPipe()) body: CreateManagerDto,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.managerService.createManager(body));
  }

  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Get('token')
  async getManagerByToken(@Req() req: any, @Res() res: any, @User() user: any) {
    return res
      .status(HttpStatus.OK)
      .json(await this.managerService.getManagerById(user.id));
  }

  @ApiParam({ name: 'managerId', required: true })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseGuards(AdminAuthGuard)
  @Get(':managerId')
  async getOrderById(
    @Req() req: any,
    @Res() res: any,
    @Param('managerId') managerId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.managerService.getManagerById(managerId));
  }

  @ApiParam({ name: 'managerId', required: true })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseGuards(AdminAuthGuard)
  @Get(':managerId/statistic')
  async getStatisticOnManager(
    @Req() req: any,
    @Res() res: any,
    @Param('managerId') managerId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.managerService.getStatisticOnManager(managerId));
  }

  @ApiParam({ name: 'managerId', required: true })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: UpdateManagerDto })
  @UseGuards(AdminAuthGuard)
  @Patch(':managerId')
  async updateManager(
    @Req() req: any,
    @Res() res: any,
    @Body(new TrimPipe()) body: UpdateManagerDto,
    @Param('managerId') managerId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.managerService.updateManager(managerId, body));
  }
}
