import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private prisma;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            email: any;
            sub: any;
            role: any;
            name: any;
        };
    }>;
    register(data: Prisma.UserCreateInput & {
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
    hasAdmin(): Promise<boolean>;
    setupAdmin(data: Prisma.UserCreateInput): Promise<{
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
