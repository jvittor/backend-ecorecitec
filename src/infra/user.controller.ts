import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthenticateUserUseCase } from '../application/usecases/user.auth.usecases';
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
        return res.status(400).json({ error: "Email, senha e nome são obrigatórios!" });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "E-mail já está em uso!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let username = name.toLowerCase().replace(/\s+/g, "_");
        let uniqueUsername = username;
        let counter = 1;

        while (await prisma.user.findUnique({ where: { username: uniqueUsername } })) {
            uniqueUsername = `${username}${counter}`;
            counter++;
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                username: uniqueUsername,
                password: hashedPassword,
                name,
                metamaskAddress: null,
            },
        });
        const token = jwt.sign(
            { id: newUser.id, role: "user" },
            process.env.SECRET_KEY as string,
            { expiresIn: "1d" }
        );

        return res.status(201).json({ user: newUser, token });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro ao registrar o usuário.";
        return res.status(500).json({ error: errorMessage });
    }
}
}