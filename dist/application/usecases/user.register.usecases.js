"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class RegisterUserUseCase {
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async execute(data) {
        const { email, password, name } = data;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Formato de e-mail inválido!');
        }
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('E-mail já está em uso!');
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        let username = name.toLowerCase().replace(/\s+/g, '_');
        let uniqueUsername = username;
        let counter = 1;
        while (await this.prisma.user.findUnique({ where: { username: uniqueUsername } })) {
            uniqueUsername = `${username}${counter}`;
            counter++;
        }
        const newUser = await this.prisma.user.create({
            data: {
                email,
                username: uniqueUsername,
                password: hashedPassword,
                name,
                metamaskAddress: null,
            },
        });
        let emailError;
        try {
            await this.emailService.sendEmail(newUser.email, 'Bem-vindo ao Ecorecitec!', `<h1>Olá, ${newUser.name}!</h1>
        <p>Obrigado por se registrar no Ecorecitec.</p>
        <p>Seus dados:</p>
        <ul>
          <li>Email: ${newUser.email}</li>
          <li>Username: ${newUser.username}</li>
        </ul>
        <p>Estamos felizes em tê-lo conosco!</p>`);
        }
        catch (error) {
            console.error('Erro ao enviar o e-mail:', error);
            emailError = 'Erro ao enviar o e-mail de boas-vindas.';
        }
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, role: 'user' }, process.env.SECRET_KEY, { expiresIn: '1d' });
        return { user: newUser, token, emailError };
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
