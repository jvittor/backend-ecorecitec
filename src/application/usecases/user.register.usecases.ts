import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { EmailService } from '../../infra/services/email.service';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface RegisterUserDTO {
  email: string;
  password: string;
  name: string;
}

export class RegisterUserUseCase {
  constructor(private prisma: PrismaClient, private emailService: EmailService) {}

  async execute(data: RegisterUserDTO): Promise<{ user: any; token: string; emailError?: string }> {
    const { email, password, name } = data;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Formato de e-mail inválido!');
    }
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('E-mail já está em uso!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
    let emailError: string | undefined;
    try {
      await this.emailService.sendEmail(
        newUser.email,
        'Bem-vindo ao Ecorecitec!',
        `<h1>Olá, ${newUser.name}!</h1>
        <p>Obrigado por se registrar no Ecorecitec.</p>
        <p>Seus dados:</p>
        <ul>
          <li>Email: ${newUser.email}</li>
          <li>Username: ${newUser.username}</li>
        </ul>
        <p>Estamos felizes em tê-lo conosco!</p>`
      );
    } catch (error) {
      console.error('Erro ao enviar o e-mail:', error);
      emailError = 'Erro ao enviar o e-mail de boas-vindas.';
    }

    const token = jwt.sign(
      { id: newUser.id, role: 'user' },
      process.env.SECRET_KEY as string,
      { expiresIn: '1d' }
    );

    return { user: newUser, token, emailError };
  }
}