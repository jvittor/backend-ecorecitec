"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const prisma_1 = require("../utils/prisma");
const user_login_usecases_1 = require("../application/usecases/user.login.usecases");
const user_register_usecases_1 = require("../application/usecases/user.register.usecases");
const email_service_1 = require("./services/email.service");
const google_service_1 = require("./services/google.service");
const user_google_login_usecases_1 = require("../application/usecases/user.google.login.usecases");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    async login(req, res) {
        const { email, password } = req.body;
        const authenticateUserUseCase = new user_login_usecases_1.AuthenticateUserUseCase(prisma_1.prisma, process.env.SECRET_KEY);
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
    async googleLogin(req, res) {
        const { tokenGoogle } = req.body;
        if (!tokenGoogle) {
            return res.status(400).json({ error: 'Token do Google é necessário!' });
        }
        try {
            const emailService = new email_service_1.EmailService();
            const googleService = new google_service_1.GoogleService();
            const googleAuthUseCase = new user_google_login_usecases_1.GoogleAuthUseCase(prisma_1.prisma, emailService, googleService, process.env.SECRET_KEY);
            const { user, token } = await googleAuthUseCase.execute({ tokenGoogle });
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({
                message: 'Login bem-sucedido com Google!',
                user: { ...user, token },
            });
        }
        catch (error) {
            console.error('Erro na autenticação com Google:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro ao autenticar com Google.';
            return res.status(500).json({ error: errorMessage });
        }
    }
    async getUser(req, res) {
        try {
            const token = req.cookies['authToken'];
            if (!token) {
                return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
            }
            let userId;
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
                userId = decoded.id;
            }
            catch (error) {
                console.error('Erro ao decodificar o token:', error);
                return res.status(401).json({ error: 'Token inválido ou expirado.' });
            }
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            console.error('Erro ao buscar o usuário:', error);
            return res.status(500).json({ error: 'Erro ao buscar o usuário.' });
        }
    }
}
exports.UserController = UserController;
