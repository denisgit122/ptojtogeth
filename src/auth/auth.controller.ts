import {
  Controller,
  HttpStatus,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmailDto, LoginDto, PasswordDto } from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.decorator';
import { IEmail } from '../orders';
import { IPassword } from '../managers/interface';
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
  async login(@Body(new TrimPipe()) loginDto: LoginDto, @Res() res: any) {
    const tokenPair = await this.authService.login(loginDto);

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
    const tokenPair = await this.authService.refresh(user.id);

    return res.status(HttpStatus.OK).json({ tokenPair });
  }

  @Post('activate')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: EmailDto })
  async sendActivateToken(
    @Req() req: any,
    @Res() res: any,
    @Body(new TrimPipe()) body: IEmail,
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
    @Body() body: IPassword,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.authService.activate(user.id, body.password));
  }
}
