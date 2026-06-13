import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(reviewerId: string, data: { needId: string, revieweeId: string, rating: number, comment?: string }) {
    // Перевірка чи заявка закрита
    const need = await this.prisma.need.findUnique({ where: { id: data.needId } });
    if (!need) throw new BadRequestException('Заявка не знайдена');
    if (need.status !== 'CLOSED') throw new BadRequestException('Відгук можна залишити лише після закриття заявки');

    // Перевірка чи відгук вже існує
    const existing = await this.prisma.review.findFirst({
      where: { needId: data.needId, reviewerId, revieweeId: data.revieweeId }
    });
    if (existing) throw new BadRequestException('Ви вже залишили відгук для цього користувача по цій заявці');

    return this.prisma.review.create({
      data: {
        reviewerId,
        revieweeId: data.revieweeId,
        needId: data.needId,
        rating: data.rating,
        comment: data.comment
      }
    });
  }

  async getUserReviews(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: { select: { id: true, name: true, avatarUrl: true, role: true } },
        need: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    return {
      avgRating: Number(avgRating),
      totalReviews: reviews.length,
      reviews
    };
  }
}
