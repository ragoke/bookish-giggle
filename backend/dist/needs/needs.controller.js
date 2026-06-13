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
exports.NeedsController = void 0;
const common_1 = require("@nestjs/common");
const needs_service_1 = require("./needs.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let NeedsController = class NeedsController {
    needsService;
    constructor(needsService) {
        this.needsService = needsService;
    }
    findAll() {
        return this.needsService.findAll();
    }
    findAllForAdmin(req) {
        if (req.user.role !== 'ADMIN')
            throw new common_1.ForbiddenException('Тільки для адміністраторів');
        return this.needsService.findAllForAdmin();
    }
    getMyNeeds(req) {
        if (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN')
            throw new common_1.ForbiddenException('Тільки для організаторів');
        return this.needsService.getMyNeeds(req.user.userId);
    }
    getMyApplications(req) {
        return this.needsService.getMyApplications(req.user.userId);
    }
    create(body, req) {
        return this.needsService.create({
            title: body.title,
            description: body.description,
            location: body.location,
            time: body.time,
            organizerId: req.user.userId,
        });
    }
    applyToNeed(id, body, req) {
        return this.needsService.applyToNeed(id, req.user.userId, body.options || [], body.message);
    }
    getApplications(id, req) {
        return this.needsService.getApplications(id, req.user.userId, req.user.role);
    }
    acceptApplication(appId, req) {
        return this.needsService.acceptApplication(appId, req.user.userId, req.user.role);
    }
    rejectApplication(appId, req) {
        return this.needsService.rejectApplication(appId, req.user.userId, req.user.role);
    }
    deleteApplication(appId, req) {
        return this.needsService.deleteApplication(appId, req.user.userId, req.user.role);
    }
    updateStatus(id, status, req) {
        return this.needsService.updateNeedStatus(id, status, req.user.userId, req.user.role);
    }
    findOne(id) {
        return this.needsService.findOne(id);
    }
    deleteNeed(id, req) {
        return this.needsService.deleteNeed(id, req.user);
    }
};
exports.NeedsController = NeedsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NeedsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NeedsController.prototype, "findAllForAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-needs'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NeedsController.prototype, "getMyNeeds", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-applications'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NeedsController.prototype, "getMyApplications", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], NeedsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/apply'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], NeedsController.prototype, "applyToNeed", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/applications'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NeedsController.prototype, "getApplications", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('applications/:appId/accept'),
    __param(0, (0, common_1.Param)('appId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NeedsController.prototype, "acceptApplication", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('applications/:appId/reject'),
    __param(0, (0, common_1.Param)('appId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NeedsController.prototype, "rejectApplication", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('applications/:appId'),
    __param(0, (0, common_1.Param)('appId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NeedsController.prototype, "deleteApplication", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], NeedsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NeedsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NeedsController.prototype, "deleteNeed", null);
exports.NeedsController = NeedsController = __decorate([
    (0, common_1.Controller)('needs'),
    __metadata("design:paramtypes", [needs_service_1.NeedsService])
], NeedsController);
//# sourceMappingURL=needs.controller.js.map