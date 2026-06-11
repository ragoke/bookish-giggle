import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { NeedsService } from './needs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('needs')
export class NeedsController {
  constructor(private readonly needsService: NeedsService) {}

  @Get()
  findAll() {
    return this.needsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.needsService.create({
      title: body.title,
      description: body.description,
      location: body.location,
      time: body.time,
      organizerId: req.user.userId,
    });
  }
}
