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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitesController = void 0;
const common_1 = require("@nestjs/common");
const invites_service_1 = require("./invites.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let InvitesController = class InvitesController {
    invitesService;
    constructor(invitesService) {
        this.invitesService = invitesService;
    }
    async generateCode(req) {
        if (req.user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Тільки адміністратор може генерувати коди');
        }
        return this.invitesService.generateCode();
    }
    async getCodes(req) {
        if (req.user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Тільки адміністратор може переглядати коди');
        }
        return this.invitesService.getCodes();
    }
    async revokeCode(req, id) {
        if (req.user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Тільки адміністратор може відкликати коди');
        }
        return this.invitesService.revokeCode(id);
    }
    async deleteCode(req, id) {
        if (req.user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Тільки адміністратор може видаляти коди');
        }
        return this.invitesService.deleteCode(id);
    }
};
exports.InvitesController = InvitesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "generateCode", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "getCodes", null);
__decorate([
    (0, common_1.Post)(':id/revoke'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "revokeCode", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "deleteCode", null);
exports.InvitesController = InvitesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('invites'),
    __metadata("design:paramtypes", [invites_service_1.InvitesService])
], InvitesController);
//# sourceMappingURL=invites.controller.js.map