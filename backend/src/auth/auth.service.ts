import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  async register(data: Prisma.UserCreateInput & { inviteCode?: string }) {
    if (data.role === 'VOLUNTEER' && !data.phone) {
      throw new UnauthorizedException('Волонтер обов\'язково має вказати номер телефону');
    }

    if (data.role === 'ORGANIZER') {
      if (!data.inviteCode) {
        throw new UnauthorizedException('Для реєстрації Організатора потрібен код доступу');
      }
      const invite = await this.prisma.inviteCode.findUnique({ where: { code: data.inviteCode } });
      if (!invite || invite.isUsed) {
        throw new UnauthorizedException('Недійсний або вже використаний код доступу');
      }
    }

    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role,
      phone: data.phone,
    });
    
    if (data.role === 'ORGANIZER' && data.inviteCode) {
      await this.prisma.inviteCode.update({
        where: { code: data.inviteCode },
        data: { isUsed: true, usedBy: user.id },
      });
    }

    const { password, ...result } = user;
    return result;
  }

  async hasAdmin() {
    const admin = await this.prisma.user.findFirst({ where: { role: 'ADMIN' } });
    return !!admin;
  }

  async setupAdmin(data: Prisma.UserCreateInput) {
    if (await this.hasAdmin()) {
      throw new UnauthorizedException('Адміністратор вже існує');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const admin = await this.usersService.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: 'ADMIN',
    });
    const { password, ...result } = admin;
    return result;
  }
}
