import {
  Controller,
  HttpStatus,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  Header,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async loginAdmin(@Body() loginDto: LoginDto, @Res() res: any) {
    const tokenPair = await this.authService.login(loginDto);

    if (!tokenPair) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Email or password is incorrect' });
    }

    return res.status(HttpStatus.OK).json({ tokenPair });
  }

  @Post('refresh')
  @UseGuards(AuthGuard('refresh'))
  async refresh(@Req() req: any, @Res() res: any, @User() user: any) {
    const tokenPair = await this.authService.refresh(user.id);

    return res.status(HttpStatus.OK).json({ tokenPair });
  }
}
