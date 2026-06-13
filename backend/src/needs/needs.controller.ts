import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
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
  @Get('all')
  findAllForAdmin(@Request() req: any) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('Тільки для адміністраторів');
    return this.needsService.findAllForAdmin();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-needs')
  getMyNeeds(@Request() req: any) {
    if (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN') throw new ForbiddenException('Тільки для організаторів');
    return this.needsService.getMyNeeds(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-applications')
  getMyApplications(@Request() req: any) {
    return this.needsService.getMyApplications(req.user.userId);
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

  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  applyToNeed(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.needsService.applyToNeed(id, req.user.userId, body.options || [], body.message);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/applications')
  getApplications(@Param('id') id: string, @Request() req: any) {
    return this.needsService.getApplications(id, req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('applications/:appId/accept')
  acceptApplication(@Param('appId') appId: string, @Request() req: any) {
    return this.needsService.acceptApplication(appId, req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('applications/:appId/reject')
  rejectApplication(@Param('appId') appId: string, @Request() req: any) {
    return this.needsService.rejectApplication(appId, req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('applications/:appId')
  deleteApplication(@Param('appId') appId: string, @Request() req: any) {
    return this.needsService.deleteApplication(appId, req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: any, @Request() req: any) {
    return this.needsService.updateNeedStatus(id, status, req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.needsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteNeed(@Param('id') id: string, @Request() req: any) {
    return this.needsService.deleteNeed(id, req.user);
  }
}
