import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthenticateUserUseCase } from '../application/usecases/user.login.usecases';
import { RegisterUserUseCase } from '../application/usecases/user.register.usecases';
import { EmailService } from './services/email.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserController {
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const authenticateUserUseCase = new AuthenticateUserUseCase(prisma, process.env.SECRET_KEY as string);

    try {
      const { user, token } = await authenticateUserUseCase.execute({ email, password });
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ user, token });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(400).json({ error: errorMessage });
    }
  }

  async register(req: Request, res: Response): Promise<Response> {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, senha e nome são obrigatórios!' });
    }

    try {
      const emailService = new EmailService();
      const registerUserUseCase = new RegisterUserUseCase(prisma, emailService);

      const { user, token } = await registerUserUseCase.execute({ email, password, name });

      return res.status(201).json({ user, token });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar o usuário.';
      return res.status(500).json({ error: errorMessage });
    }
  }
}