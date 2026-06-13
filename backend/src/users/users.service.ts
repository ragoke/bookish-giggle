import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll(currentUserId: string) {
    return this.prisma.user.findMany({
      where: {
        id: {
          not: currentUserId
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id }
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        role: true,
        createdAt: true,
      }
    });
  }

  async updateProfile(id: string, data: { name?: string; phone?: string; bio?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        role: true,
      }
    });
  }

  async updateAvatar(id: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id },
      data: { avatarUrl },
      select: {
        id: true,
        avatarUrl: true,
      }
    });
  }

  async updatePassword(id: string, hash: string) {
    return this.prisma.user.update({
      where: { id },
      data: { password: hash }
    });
  }
}
