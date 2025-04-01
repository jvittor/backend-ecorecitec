import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

interface AuthenticateUserDTO {
  email: string;
  password: string;
}

export class AuthenticateUserUseCase {
  constructor(private prisma: PrismaClient, private secretKey: string) {}

  async execute(data: AuthenticateUserDTO): Promise<{ user: any; token: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });

    if (!user) {
      throw new Error('Usuário não encontrado!');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new Error('Senha incorreta!');
    }

    const token = jwt.sign({ id: user.id }, this.secretKey, {
      expiresIn: '1d',
    });

    return { user, token };
  }
}