import { PrismaService } from '../prisma/prisma.service';
export declare class InvitesService {
    private prisma;
    constructor(prisma: PrismaService);
    generateCode(): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        isUsed: boolean;
        usedBy: string | null;
        expiresAt: Date;
    }>;
    getCodes(): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        isUsed: boolean;
        usedBy: string | null;
        expiresAt: Date;
    }[]>;
    revokeCode(id: string): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        isUsed: boolean;
        usedBy: string | null;
        expiresAt: Date;
    }>;
    deleteCode(id: string): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        isUsed: boolean;
        usedBy: string | null;
        expiresAt: Date;
    }>;
}
