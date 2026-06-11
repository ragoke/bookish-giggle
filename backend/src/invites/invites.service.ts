import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  async generateCode() {
    // Генерація 8-значного випадкового коду (літери та цифри)
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 хвилин
    return this.prisma.inviteCode.create({
      data: {
        code,
        expiresAt,
      },
    });
  }

  async getCodes() {
    return this.prisma.inviteCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
