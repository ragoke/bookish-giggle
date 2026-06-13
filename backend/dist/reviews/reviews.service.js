"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReview(reviewerId, data) {
        const need = await this.prisma.need.findUnique({ where: { id: data.needId } });
        if (!need)
            throw new common_1.BadRequestException('Заявка не знайдена');
        if (need.status !== 'CLOSED')
            throw new common_1.BadRequestException('Відгук можна залишити лише після закриття заявки');
        const existing = await this.prisma.review.findFirst({
            where: { needId: data.needId, reviewerId, revieweeId: data.revieweeId }
        });
        if (existing)
            throw new common_1.BadRequestException('Ви вже залишили відгук для цього користувача по цій заявці');
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
    async getUserReviews(userId) {
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
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map