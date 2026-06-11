import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  async generateCode() {
    // Генерація 8-значного випадкового коду (літери та цифри)
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    return this.prisma.inviteCode.create({
      data: {
        code,
      },
    });
  }

  async getCodes() {
    return this.prisma.inviteCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
