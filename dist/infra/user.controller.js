"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const prisma_1 = require("../utils/prisma");
const user_auth_usecases_1 = require("../application/usecases/user.auth.usecases");
const user_register_usecases_1 = require("../application/usecases/user.register.usecases");
const email_service_1 = require("./services/email.service");
class UserController {
    async login(req, res) {
        const { email, password } = req.body;
        const authenticateUserUseCase = new user_auth_usecases_1.AuthenticateUserUseCase(prisma_1.prisma, process.env.SECRET_KEY);
        try {
            const { user, token } = await authenticateUserUseCase.execute({ email, password });
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({ user, token });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            return res.status(400).json({ error: errorMessage });
        }
    }
    async register(req, res) {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, senha e nome são obrigatórios!' });
        }
        try {
            const emailService = new email_service_1.EmailService();
            const registerUserUseCase = new user_register_usecases_1.RegisterUserUseCase(prisma_1.prisma, emailService);
            const { user, token } = await registerUserUseCase.execute({ email, password, name });
            return res.status(201).json({ user, token });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar o usuário.';
            return res.status(500).json({ error: errorMessage });
        }
    }
}
exports.UserController = UserController;
