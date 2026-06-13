import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(req: any, body: {
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
    getUserReviews(id: string): Promise<{
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
