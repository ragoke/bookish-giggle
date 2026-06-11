import { Controller, Post, Body, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req: any) {
    const user = await this.authService.validateUser(req.email, req.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: Prisma.UserCreateInput & { inviteCode?: string }) {
    return this.authService.register(body);
  }

  @Get('has-admin')
  async hasAdmin() {
    const hasAdmin = await this.authService.hasAdmin();
    return { hasAdmin };
  }

  @Post('setup-admin')
  async setupAdmin(@Body() body: Prisma.UserCreateInput) {
    return this.authService.setupAdmin(body);
  }
}
