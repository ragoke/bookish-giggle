"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeedsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NeedsService = class NeedsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        const count = await this.prisma.need.count();
        if (count === 0) {
            console.log('Seeding mock needs...');
            let user = await this.prisma.user.findFirst({ where: { email: 'org@test.com' } });
            if (!user) {
                user = await this.prisma.user.create({
                    data: {
                        email: 'org@test.com',
                        name: 'БФ "Турбота"',
                        password: 'hashedpassword',
                        role: 'ORGANIZER'
                    }
                });
            }
            await this.prisma.need.createMany({
                data: [
                    {
                        title: 'Допомога з розвезенням продуктів для літніх людей',
                        description: 'Потрібні волонтери з авто для розвезення пакунків.',
                        location: 'Київ',
                        time: 'Сьогодні, 14:00',
                        organizerId: user.id
                    },
                    {
                        title: 'Потрібні руки для сортування гуманітарної допомоги',
                        description: 'Очікуємо фуру з Німеччини, потрібна допомога в розвантаженні.',
                        location: 'Львів',
                        time: 'Завтра, 10:00',
                        organizerId: user.id
                    },
                    {
                        title: 'Допомога в притулку для тварин',
                        description: 'Вигул собак та прибирання вольєрів.',
                        location: 'Одеса',
                        time: 'На вихідних',
                        organizerId: user.id
                    }
                ]
            });
            console.log('Mock needs seeded successfully!');
        }
    }
    async findAll() {
        return this.prisma.need.findMany({
            where: {
                status: { in: ['OPEN', 'IN_PROGRESS'] }
            },
            include: {
                organizer: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async findAllForAdmin() {
        return this.prisma.need.findMany({
            include: {
                organizer: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getMyNeeds(organizerId) {
        return this.prisma.need.findMany({
            where: { organizerId },
            include: {
                organizer: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOne(id) {
        const need = await this.prisma.need.findUnique({
            where: { id },
            include: {
                organizer: { select: { name: true } }
            }
        });
        if (!need)
            throw new common_1.NotFoundException('Заявку не знайдено');
        return need;
    }
    async create(data) {
        return this.prisma.need.create({
            data,
        });
    }
    async applyToNeed(needId, volunteerId, options, message) {
        const existing = await this.prisma.application.findFirst({
            where: { needId, volunteerId }
        });
        if (existing) {
            throw new Error('Ви вже відгукнулись на цю заявку');
        }
        return this.prisma.application.create({
            data: {
                needId,
                volunteerId,
                options,
                message
            }
        });
    }
    async getApplications(needId, userId, role) {
        const need = await this.prisma.need.findUnique({ where: { id: needId } });
        if (!need)
            throw new Error('Заявку не знайдено');
        if (need.organizerId !== userId && role !== 'ADMIN') {
            throw new Error('Немає доступу');
        }
        const applications = await this.prisma.application.findMany({
            where: { needId },
            include: {
                volunteer: {
                    select: { id: true, name: true, phone: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const reviews = await this.prisma.review.findMany({
            where: { needId, reviewerId: userId }
        });
        return applications.map(app => ({
            ...app,
            hasReviewed: reviews.some((r) => r.revieweeId === app.volunteer.id)
        }));
    }
    async acceptApplication(appId, userId, role) {
        const application = await this.prisma.application.findUnique({
            where: { id: appId },
            include: { need: true }
        });
        if (!application)
            throw new Error('Відгук не знайдено');
        if (application.need.organizerId !== userId && role !== 'ADMIN') {
            throw new Error('Немає доступу');
        }
        if (application.need.status === 'OPEN') {
            await this.prisma.need.update({
                where: { id: application.needId },
                data: { status: 'IN_PROGRESS' }
            });
        }
        return this.prisma.application.update({
            where: { id: appId },
            data: { status: 'ACCEPTED' }
        });
    }
    async updateNeedStatus(needId, status, userId, role) {
        const need = await this.prisma.need.findUnique({ where: { id: needId } });
        if (!need)
            throw new Error('Заявку не знайдено');
        if (need.organizerId !== userId && role !== 'ADMIN') {
            throw new Error('Немає доступу');
        }
        return this.prisma.need.update({
            where: { id: needId },
            data: { status }
        });
    }
    async getMyApplications(volunteerId) {
        const applications = await this.prisma.application.findMany({
            where: { volunteerId },
            include: {
                need: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        organizer: { select: { id: true, name: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const reviews = await this.prisma.review.findMany({
            where: { reviewerId: volunteerId }
        });
        return applications.map(app => ({
            ...app,
            hasReviewed: reviews.some(r => r.needId === app.need.id)
        }));
    }
    async rejectApplication(appId, userId, role) {
        const application = await this.prisma.application.findUnique({
            where: { id: appId },
            include: { need: true }
        });
        if (!application)
            throw new Error('Відгук не знайдено');
        if (application.need.organizerId !== userId && role !== 'ADMIN') {
            throw new Error('Немає доступу');
        }
        return this.prisma.application.update({
            where: { id: appId },
            data: { status: 'REJECTED' }
        });
    }
    async deleteApplication(appId, userId, role) {
        const application = await this.prisma.application.findUnique({
            where: { id: appId },
            include: { need: true }
        });
        if (!application)
            throw new Error('Відгук не знайдено');
        if (application.need.organizerId !== userId && role !== 'ADMIN') {
            throw new Error('Немає доступу');
        }
        return this.prisma.application.delete({
            where: { id: appId }
        });
    }
    async deleteNeed(needId, user) {
        const need = await this.prisma.need.findUnique({ where: { id: needId } });
        if (!need)
            throw new common_1.NotFoundException('Заявку не знайдено');
        if (user.role !== 'ADMIN' && need.organizerId !== user.userId) {
            throw new common_1.ForbiddenException('Тільки адміністратор або власник можуть видалити заявку');
        }
        return this.prisma.need.delete({
            where: { id: needId }
        });
    }
};
exports.NeedsService = NeedsService;
exports.NeedsService = NeedsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NeedsService);
//# sourceMappingURL=needs.service.js.map