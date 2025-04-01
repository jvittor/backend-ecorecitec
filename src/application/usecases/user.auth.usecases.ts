import { IUserRepository } from '../../domain/repositories/user.repositories';
import { User } from '../../domain/entities/user.entities';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface AuthenticateUserDTO {
  email: string;
  password: string;
}

export class AuthenticateUserUseCase {
  constructor(private userRepository: IUserRepository, private secretKey: string) {}

  async execute(data: AuthenticateUserDTO): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error('Usuário não encontrado!');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new Error('Senha incorreta!');
    }

    const token = jwt.sign({ id: user.id, role: user.role }, this.secretKey, {
      expiresIn: '1d',
    });

    return { user, token };
  }
}