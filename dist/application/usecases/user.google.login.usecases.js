"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthUseCase = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class GoogleAuthUseCase {
    constructor(prisma, emailService, googleService, secretKey) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.googleService = googleService;
        this.secretKey = secretKey;
    }
    async execute(data) {
        const { tokenGoogle } = data;
        if (!tokenGoogle) {
            throw new Error('Token do Google é necessário!');
        }
        const { email, name, picture } = await this.googleService.getUserInfo(tokenGoogle);
        let user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            const randomPassword = this.generateUniquePassword();
            user = await this.prisma.user.create({
                data: {
                    email,
                    username: name || 'Usuário do Google',
                    imageBase64: picture || '',
                    password: randomPassword,
                    metamaskAddress: null,
                },
            });
            await this.emailService.sendEmail(user.email, 'Bem-vindo ao Ecorecitec!', `<h1>Olá, ${user.username}!</h1>
        <p>Obrigado por se registrar no Ecorecitec via Google.</p>
        <p>Seus dados:</p>
        <ul>
          <li>Email: ${user.email}</li>
          <li>Username: ${user.username}</li>
          <li>Senha: ${randomPassword}</li>
        </ul>
        <p>Estamos felizes em tê-lo conosco!</p>`);
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, this.secretKey, { expiresIn: '1d' });
        return { user, token };
    }
    generateUniquePassword() {
        const randomString = Math.random().toString(36).slice(-8);
        const timestamp = Date.now().toString(36);
        return `${randomString}-${timestamp}`;
    }
}
exports.GoogleAuthUseCase = GoogleAuthUseCase;
