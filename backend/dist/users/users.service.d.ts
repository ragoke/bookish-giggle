import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    findAll(currentUserId: string): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        avatarUrl: string | null;
        bio: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findById(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        bio: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    } | null>;
    updateProfile(id: string, data: {
        name?: string;
        phone?: string;
        bio?: string;
    }): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        bio: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    updateAvatar(id: string, avatarUrl: string): Promise<{
        id: string;
        avatarUrl: string | null;
    }>;
    updatePassword(id: string, hash: string): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        avatarUrl: string | null;
        bio: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
