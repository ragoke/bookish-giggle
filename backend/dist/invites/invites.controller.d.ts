import { InvitesService } from './invites.service';
export declare class InvitesController {
    private readonly invitesService;
    constructor(invitesService: InvitesService);
    generateCode(req: any): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        isUsed: boolean;
        usedBy: string | null;
        expiresAt: Date;
    }>;
    getCodes(req: any): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        isUsed: boolean;
        usedBy: string | null;
        expiresAt: Date;
    }[]>;
    revokeCode(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        isUsed: boolean;
        usedBy: string | null;
        expiresAt: Date;
    }>;
    deleteCode(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        isUsed: boolean;
        usedBy: string | null;
        expiresAt: Date;
    }>;
}
