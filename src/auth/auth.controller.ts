import {
  Controller,
  HttpStatus,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChangePasswordDto, EmailDto, LoginDto, PasswordDto } from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.decorator';
import { TrimPipe } from '../core';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(@Body(new TrimPipe()) loginBody: LoginDto, @Res() res: any) {
    const tokenPair = await this.authService.login(loginBody);

    if (!tokenPair) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Email or password is incorrect' });
    }

    return res.status(HttpStatus.OK).json({ tokenPair });
  }

  @Post('refresh')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseGuards(AuthGuard('refresh'))
  @ApiBearerAuth()
  async refresh(@Req() req: any, @Res() res: any, @User() user: any) {
    const token = req.headers['authorization'];

    const tokenPair = await this.authService.refresh(user.id, token);

    return res.status(HttpStatus.OK).json({ tokenPair });
  }

  @Post('activate')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: EmailDto })
  async sendActivateToken(
    @Req() req: any,
    @Res() res: any,
    @Body(new TrimPipe()) body: EmailDto,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.authService.sendActivateToken(body.email));
  }

  @Put('activate')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiQuery({ name: 'token', required: true })
  @ApiBody({ type: PasswordDto })
  @UseGuards(AuthGuard('activate'))
  async activate(
    @Req() req: any,
    @Res() res: any,
    @User() user: any,
    @Body() body: PasswordDto,
    @Query('token') token: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.authService.activate(user.id, body.password, token));
  }

  @Post('change/password')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Req() req: any,
    @Res() res: any,
    @Body() body: ChangePasswordDto,
    @User() user: any,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.authService.changePassword(body, user.id));
  }

  @Post('forgot/password')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: EmailDto })
  async sendForgotPasswordToken(
    @Req() req: any,
    @Res() res: any,
    @Body(new TrimPipe()) body: EmailDto,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.authService.sendForgotPasswordToken(body.email));
  }

  @Put('forgot/password')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiQuery({ name: 'token', required: true })
  @ApiBody({ type: PasswordDto })
  @UseGuards(AuthGuard('forgot'))
  async setForgotPassword(
    @Req() req: any,
    @Res() res: any,
    @User() user: any,
    @Body() body: PasswordDto,
    @Query('token') token: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(
        await this.authService.setForgotPassword(user.id, body.password, token),
      );
  }
}
