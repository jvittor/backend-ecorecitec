import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { GoogleService } from '../../infra/services/google.service';
import { EmailService } from '../../infra/services/email.service';

interface GoogleAuthDTO {
  tokenGoogle: string;
}

export class GoogleAuthUseCase {

  constructor(
    private prisma: PrismaClient,
    private emailService: EmailService,
    private googleService: GoogleService,
    private secretKey: string
  ) {
  }

  async execute(data: GoogleAuthDTO): Promise<{ user: any; token: string; }> {
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

      await this.emailService.sendEmail(
        user.email,
        'Bem-vindo ao Ecorecitec!',
        `<h1>Olá, ${user.username}!</h1>
        <p>Obrigado por se registrar no Ecorecitec via Google.</p>
        <p>Seus dados:</p>
        <ul>
          <li>Email: ${user.email}</li>
          <li>Username: ${user.username}</li>
          <li>Senha: ${randomPassword}</li>
        </ul>
        <p>Estamos felizes em tê-lo conosco!</p>`
      );
    }


    const token = jwt.sign(
      { id: user.id },
      this.secretKey,
      { expiresIn: '1d' }
    );

    return { user, token };
  }
  private generateUniquePassword(): string {
    const randomString = Math.random().toString(36).slice(-8);
    const timestamp = Date.now().toString(36);
    return `${randomString}-${timestamp}`;
  }
}