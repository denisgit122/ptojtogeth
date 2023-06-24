import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ManagersService } from './managers.service';

@ApiTags('Managers')
@Controller('managers')
@UseGuards(AuthGuard('access'))
@ApiBearerAuth()
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}
}
