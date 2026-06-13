import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        bio: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    updateProfile(req: any, body: {
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
    updatePassword(req: any, body: any): Promise<{
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
    uploadAvatar(req: any, file: any): Promise<{
        id: string;
        avatarUrl: string | null;
    }>;
    findAll(req: any): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
    remove(id: string, req: any): Promise<{
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
