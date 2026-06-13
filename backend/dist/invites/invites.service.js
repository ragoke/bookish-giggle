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
exports.InvitesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InvitesService = class InvitesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateCode() {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        return this.prisma.inviteCode.create({
            data: {
                code,
                expiresAt,
            },
        });
    }
    async getCodes() {
        return this.prisma.inviteCode.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async revokeCode(id) {
        return this.prisma.inviteCode.update({
            where: { id },
            data: { isUsed: true },
        });
    }
    async deleteCode(id) {
        return this.prisma.inviteCode.delete({
            where: { id },
        });
    }
};
exports.InvitesService = InvitesService;
exports.InvitesService = InvitesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvitesService);
//# sourceMappingURL=invites.service.js.map