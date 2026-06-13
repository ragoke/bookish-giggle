import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class NeedsService implements OnModuleInit {
    private prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
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
    findAllForAdmin(): Promise<({
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
    getMyNeeds(organizerId: string): Promise<({
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
    create(data: {
        title: string;
        description: string;
        location: string;
        time: string;
        organizerId: string;
    }): Promise<{
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
    applyToNeed(needId: string, volunteerId: string, options: string[], message?: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        options: string[];
        message: string | null;
        needId: string;
        volunteerId: string;
    }>;
    getApplications(needId: string, userId: string, role: string): Promise<{
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
    acceptApplication(appId: string, userId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        options: string[];
        message: string | null;
        needId: string;
        volunteerId: string;
    }>;
    updateNeedStatus(needId: string, status: string, userId: string, role: string): Promise<{
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
    getMyApplications(volunteerId: string): Promise<{
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
    rejectApplication(appId: string, userId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        options: string[];
        message: string | null;
        needId: string;
        volunteerId: string;
    }>;
    deleteApplication(appId: string, userId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        options: string[];
        message: string | null;
        needId: string;
        volunteerId: string;
    }>;
    deleteNeed(needId: string, user: any): Promise<{
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
