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
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import { CreateManagersDto } from './dto';
import { TrimPipe } from '../core';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Managers')
@Controller('managers')
@UseGuards(AuthGuard('access'))
@ApiBearerAuth()
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getManagersList(@Req() req: any, @Res() res: any) {
    return res
      .status(HttpStatus.OK)
      .json(await this.managersService.getManagersList());
  }

  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateManagersDto })
  @Post('create')
  async createManager(
    @Req() req: any,
    @Res() res: any,
    @Body(new TrimPipe()) body: CreateManagersDto,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.managersService.createManager(body));
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
      .json(await this.managersService.getManagerById(managerId));
  }
}
