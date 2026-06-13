import { Injectable, OnModuleInit, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NeedsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.need.count();
    if (count === 0) {
      console.log('Seeding mock needs...');
      
      // Створюємо організатора для прив'язки заявок
      let user = await this.prisma.user.findFirst({ where: { email: 'org@test.com' } });
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: 'org@test.com',
            name: 'БФ "Турбота"',
            password: 'hashedpassword',
            role: 'ORGANIZER'
          }
        });
      }

      await this.prisma.need.createMany({
        data: [
          {
            title: 'Допомога з розвезенням продуктів для літніх людей',
            description: 'Потрібні волонтери з авто для розвезення пакунків.',
            location: 'Київ',
            time: 'Сьогодні, 14:00',
            organizerId: user.id
          },
          {
            title: 'Потрібні руки для сортування гуманітарної допомоги',
            description: 'Очікуємо фуру з Німеччини, потрібна допомога в розвантаженні.',
            location: 'Львів',
            time: 'Завтра, 10:00',
            organizerId: user.id
          },
          {
            title: 'Допомога в притулку для тварин',
            description: 'Вигул собак та прибирання вольєрів.',
            location: 'Одеса',
            time: 'На вихідних',
            organizerId: user.id
          }
        ]
      });
      console.log('Mock needs seeded successfully!');
    }
  }

  async findAll() {
    return this.prisma.need.findMany({
      where: {
        status: { in: ['OPEN', 'IN_PROGRESS'] }
      },
      include: {
        organizer: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findAllForAdmin() {
    return this.prisma.need.findMany({
      include: {
        organizer: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getMyNeeds(organizerId: string) {
    return this.prisma.need.findMany({
      where: { organizerId },
      include: {
        organizer: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const need = await this.prisma.need.findUnique({
      where: { id },
      include: {
        organizer: { select: { name: true } }
      }
    });
    if (!need) throw new NotFoundException('Заявку не знайдено');
    return need;
  }

  async create(data: { title: string; description: string; location: string; time: string; organizerId: string }) {
    return this.prisma.need.create({
      data,
    });
  }

  async applyToNeed(needId: string, volunteerId: string, options: string[], message?: string) {
    const existing = await this.prisma.application.findFirst({
      where: { needId, volunteerId }
    });
    if (existing) {
      throw new Error('Ви вже відгукнулись на цю заявку');
    }
    return this.prisma.application.create({
      data: {
        needId,
        volunteerId,
        options,
        message
      }
    });
  }

  async getApplications(needId: string, userId: string, role: string) {
    const need = await this.prisma.need.findUnique({ where: { id: needId } });
    if (!need) throw new Error('Заявку не знайдено');
    if (need.organizerId !== userId && role !== 'ADMIN') {
      throw new Error('Немає доступу');
    }
    const applications = await this.prisma.application.findMany({
      where: { needId },
      include: {
        volunteer: {
          select: { id: true, name: true, phone: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const reviews = await this.prisma.review.findMany({
      where: { needId, reviewerId: userId }
    });

    return applications.map(app => ({
      ...app,
      hasReviewed: reviews.some(r => r.revieweeId === app.volunteer.id)
    }));
  }

  async acceptApplication(appId: string, userId: string, role: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: appId },
      include: { need: true }
    });
    if (!application) throw new Error('Відгук не знайдено');
    if (application.need.organizerId !== userId && role !== 'ADMIN') {
      throw new Error('Немає доступу');
    }
    
    // Оновлюємо статус заявки, якщо вона була OPEN
    if (application.need.status === 'OPEN') {
      await this.prisma.need.update({
        where: { id: application.needId },
        data: { status: 'IN_PROGRESS' }
      });
    }

    return this.prisma.application.update({
      where: { id: appId },
      data: { status: 'ACCEPTED' }
    });
  }

  async updateNeedStatus(needId: string, status: string, userId: string, role: string) {
    const need = await this.prisma.need.findUnique({ where: { id: needId } });
    if (!need) throw new Error('Заявку не знайдено');
    if (need.organizerId !== userId && role !== 'ADMIN') {
      throw new Error('Немає доступу');
    }
    return this.prisma.need.update({
      where: { id: needId },
      data: { status }
    });
  }

  async getMyApplications(volunteerId: string) {
    const applications = await this.prisma.application.findMany({
      where: { volunteerId },
      include: {
        need: {
          select: {
            id: true,
            title: true,
            status: true,
            organizer: { select: { id: true, name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const reviews = await this.prisma.review.findMany({
      where: { reviewerId: volunteerId }
    });

    return applications.map(app => ({
      ...app,
      hasReviewed: reviews.some(r => r.needId === app.need.id)
    }));
  }

  async rejectApplication(appId: string, userId: string, role: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: appId },
      include: { need: true }
    });
    if (!application) throw new Error('Відгук не знайдено');
    if (application.need.organizerId !== userId && role !== 'ADMIN') {
      throw new Error('Немає доступу');
    }
    return this.prisma.application.update({
      where: { id: appId },
      data: { status: 'REJECTED' }
    });
  }

  async deleteApplication(appId: string, userId: string, role: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: appId },
      include: { need: true }
    });
    if (!application) throw new Error('Відгук не знайдено');
    if (application.need.organizerId !== userId && role !== 'ADMIN') {
      throw new Error('Немає доступу');
    }
    return this.prisma.application.delete({
      where: { id: appId }
    });
  }

  async deleteNeed(needId: string, user: any) {
    const need = await this.prisma.need.findUnique({ where: { id: needId } });
    if (!need) throw new NotFoundException('Заявку не знайдено');

    if (user.role !== 'ADMIN' && need.organizerId !== user.userId) {
      throw new ForbiddenException('Тільки адміністратор або власник можуть видалити заявку');
    }

    return this.prisma.need.delete({
      where: { id: needId }
    });
  }
}
