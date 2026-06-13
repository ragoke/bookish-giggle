import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(@Request() req: any, @Body() body: { needId: string, revieweeId: string, rating: number, comment?: string }) {
    return this.reviewsService.createReview(req.user.sub || req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUserReviews(@Param('id') id: string) {
    return this.reviewsService.getUserReviews(id);
  }
}
