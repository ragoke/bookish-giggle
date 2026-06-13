"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    prisma;
    constructor(usersService, jwtService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role, name: user.name };
        return {
            access_token: this.jwtService.sign(payload),
            user: payload,
        };
    }
    async register(data) {
        if (data.role === 'VOLUNTEER' && !data.phone) {
            throw new common_1.UnauthorizedException('Волонтер обов\'язково має вказати номер телефону');
        }
        if (data.role === 'ORGANIZER') {
            if (!data.inviteCode) {
                throw new common_1.UnauthorizedException('Для реєстрації Організатора потрібен код доступу');
            }
            const invite = await this.prisma.inviteCode.findUnique({ where: { code: data.inviteCode } });
            if (!invite || invite.isUsed) {
                throw new common_1.UnauthorizedException('Недійсний або вже використаний код доступу');
            }
            if (invite.expiresAt < new Date()) {
                throw new common_1.UnauthorizedException('Термін дії коду закінчився');
            }
        }
        const existingUser = await this.usersService.findByEmail(data.email);
        if (existingUser) {
            throw new common_1.UnauthorizedException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.usersService.create({
            email: data.email,
            name: data.name,
            password: hashedPassword,
            role: data.role,
            phone: data.phone,
        });
        if (data.role === 'ORGANIZER' && data.inviteCode) {
            await this.prisma.inviteCode.update({
                where: { code: data.inviteCode },
                data: { isUsed: true, usedBy: user.id },
            });
        }
        const { password, ...result } = user;
        return result;
    }
    async hasAdmin() {
        const admin = await this.prisma.user.findFirst({ where: { role: 'ADMIN' } });
        return !!admin;
    }
    async setupAdmin(data) {
        if (await this.hasAdmin()) {
            throw new common_1.UnauthorizedException('Адміністратор вже існує');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const admin = await this.usersService.create({
            email: data.email,
            name: data.name,
            password: hashedPassword,
            role: 'ADMIN',
        });
        const { password, ...result } = admin;
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map