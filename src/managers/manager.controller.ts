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
  Param, Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import {CreateManagerDto, UpdateManagerDto} from './dto';
import { TrimPipe } from '../core';
import { AdminAuthGuard } from '../admin';

@ApiTags('Managers')
@Controller('managers')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getManagersList(@Req() req: any, @Res() res: any) {
    return res
      .status(HttpStatus.OK)
      .json(await this.managerService.getManagersList());
  }

  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateManagerDto })
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

  @ApiParam({ name: 'managerId', required: true })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Get(':managerId')
  async getOrderById(
    @Req() req: any,
    @Res() res: any,
    @Param('managerId') managerId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.managerService.getManagerByIdOrEmail(managerId));
  }

  @ApiParam({ name: 'managerId', required: true })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: UpdateManagerDto })
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
