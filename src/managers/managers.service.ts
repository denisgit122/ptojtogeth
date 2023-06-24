import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core';

@Injectable()
export class ManagersService {
  constructor(private readonly prismaService: PrismaService) {}
}
