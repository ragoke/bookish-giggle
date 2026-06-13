import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            email: any;
            sub: any;
            role: any;
            name: any;
        };
    }>;
    register(body: Prisma.UserCreateInput & {
        inviteCode?: string;
    }): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        bio: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    hasAdmin(): Promise<{
        hasAdmin: boolean;
    }>;
    setupAdmin(body: Prisma.UserCreateInput): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        bio: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
