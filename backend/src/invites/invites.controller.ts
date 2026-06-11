import { Controller, Get, Post, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  async generateCode(@Request() req: any) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Тільки адміністратор може генерувати коди');
    }
    return this.invitesService.generateCode();
  }

  @Get()
  async getCodes(@Request() req: any) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Тільки адміністратор може переглядати коди');
    }
    return this.invitesService.getCodes();
  }
}
