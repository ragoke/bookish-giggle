import { Controller, Get, Delete, Param, UseGuards, Request, ForbiddenException, Put, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.sub || req.user.userId);
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(@Request() req: any, @Body() body: { name?: string; phone?: string; bio?: string }) {
    return this.usersService.updateProfile(req.user.sub || req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/password')
  async updatePassword(@Request() req: any, @Body() body: any) {
    const user = await this.usersService.findById(req.user.sub || req.user.userId);
    if (!user) throw new BadRequestException('User not found');

    const fullUser = await this.usersService.findByEmail(user.email);
    if (!fullUser) throw new BadRequestException('User not found');

    const isMatch = await bcrypt.compare(body.oldPassword, fullUser.password);
    if (!isMatch) throw new BadRequestException('Невірний старий пароль');

    const hash = await bcrypt.hash(body.newPassword, 10);
    return this.usersService.updatePassword(user.id, hash);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = join(__dirname, '..', '..', 'uploads');
        if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async uploadAvatar(@Request() req: any, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Файл не завантажено');
    const avatarUrl = `/api/uploads/${file.filename}`;
    return this.usersService.updateAvatar(req.user.sub || req.user.userId, avatarUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Тільки адміністратор може переглядати список користувачів');
    }
    return this.usersService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Тільки адміністратор може видаляти користувачів');
    }
    if (req.user.userId === id) {
      throw new ForbiddenException('Ви не можете видалити самі себе');
    }
    return this.usersService.remove(id);
  }
}
