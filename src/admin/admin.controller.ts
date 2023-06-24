import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, HttpStatus, Post, Res } from '@nestjs/common';
import * as process from 'process';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createAdmin(@Res() res: any) {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME;
    const surname = process.env.ADMIN_SURNAME;

    const adminExists = await this.adminService.checkAdminExistence();

    if (adminExists) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Admin is already exist' });
    }

    await this.adminService.createAdmin(email, password, name, surname);

    return res.sendStatus(HttpStatus.CREATED);
  }
}
