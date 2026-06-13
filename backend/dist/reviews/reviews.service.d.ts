import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    createReview(reviewerId: string, data: {
        needId: string;
        revieweeId: string;
        rating: number;
        comment?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        needId: string;
        rating: number;
        comment: string | null;
        revieweeId: string;
        reviewerId: string;
    }>;
    getUserReviews(userId: string): Promise<{
        avgRating: number;
        totalReviews: number;
        reviews: ({
            need: {
                id: string;
                title: string;
            };
            reviewer: {
                name: string;
                id: string;
                avatarUrl: string | null;
                role: import("@prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            createdAt: Date;
            needId: string;
            rating: number;
            comment: string | null;
            revieweeId: string;
            reviewerId: string;
        })[];
    }>;
}
