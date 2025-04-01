import { Request, Response } from 'express';
import { AuthenticateUserUseCase } from '../application/usecases/user.auth.usecases';
import { prisma } from '../utils/prisma';

export class UserController {
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const authenticateUserUseCase = new AuthenticateUserUseCase(prisma, process.env.SECRET_KEY as string);

    try {
      const { user, token } = await authenticateUserUseCase.execute({ email, password });
      return res.status(200).json({ user, token });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(400).json({ error: errorMessage });
    }
  }
}