"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateUserUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthenticateUserUseCase {
    constructor(prisma, secretKey) {
        this.prisma = prisma;
        this.secretKey = secretKey;
    }
    async execute(data) {
        const user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (!user) {
            throw new Error('Usuário não encontrado!');
        }
        const isValidPassword = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isValidPassword) {
            throw new Error('Senha incorreta!');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, this.secretKey, {
            expiresIn: '1d',
        });
        return { user, token };
    }
}
exports.AuthenticateUserUseCase = AuthenticateUserUseCase;
