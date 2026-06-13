import { NeedsService } from './needs.service';
export declare class NeedsController {
    private readonly needsService;
    constructor(needsService: NeedsService);
    findAll(): Promise<({
        organizer: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: string;
        location: string;
        time: string;
        organizerId: string;
    })[]>;
    findAllForAdmin(req: any): Promise<({
        organizer: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: string;
        location: string;
        time: string;
        organizerId: string;
    })[]>;
    getMyNeeds(req: any): Promise<({
        organizer: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: string;
        location: string;
        time: string;
        organizerId: string;
    })[]>;
    getMyApplications(req: any): Promise<{
        hasReviewed: boolean;
        need: {
            id: string;
            title: string;
            status: string;
            organizer: {
                name: string;
                id: string;
            };
        };
        id: string;
        createdAt: Date;
        status: string;
        options: string[];
        message: string | null;
        needId: string;
        volunteerId: string;
    }[]>;
    create(body: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: string;
        location: string;
        time: string;
        organizerId: string;
    }>;
    applyToNeed(id: string, body: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        options: string[];
        message: string | null;
        needId: string;
        volunteerId: string;
    }>;
    getApplications(id: string, req: any): Promise<{
        hasReviewed: boolean;
        volunteer: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
        };
        id: string;
        createdAt: Date;
        status: string;
        options: string[];
        message: string | null;
        needId: string;
        volunteerId: string;
    }[]>;
    acceptApplication(appId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        options: string[];
        message: string | null;
        needId: string;
        volunteerId: string;
    }>;
    rejectApplication(appId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        options: string[];
        message: string | null;
        needId: string;
        volunteerId: string;
    }>;
    deleteApplication(appId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        options: string[];
        message: string | null;
        needId: string;
        volunteerId: string;
    }>;
    updateStatus(id: string, status: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: string;
        location: string;
        time: string;
        organizerId: string;
    }>;
    findOne(id: string): Promise<{
        organizer: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: string;
        location: string;
        time: string;
        organizerId: string;
    }>;
    deleteNeed(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: string;
        location: string;
        time: string;
        organizerId: string;
    }>;
}
