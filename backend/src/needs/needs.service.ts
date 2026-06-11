import { Injectable, OnModuleInit } from '@nestjs/common';
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
}
