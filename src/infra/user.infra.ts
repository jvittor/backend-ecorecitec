import { IUserRepository } from '../domain/repositories/user.repositories';
import { User } from '../domain/entities/user.entities';
import { prisma } from "../utils/prisma";

export class PrismaUserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return new User(user.id, user.email, user.username, user.password, user.imageBase64 ?? undefined);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return new User(user.id, user.email, user.username, user.password, user.imageBase64 ?? undefined);
  }

  async save(user: User): Promise<User> {
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        password: user.password,
        imageBase64: user.imageBase64,
      },
    });
    return new User(createdUser.id, createdUser.email, createdUser.username, createdUser.password, createdUser.imageBase64 ?? undefined);
  }

  async deleteById(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        username: data.username,
        password: data.password,
        imageBase64: data.imageBase64,
      },
    });
  
    return new User(
      updatedUser.id,
      updatedUser.email,
      updatedUser.username,
      updatedUser.password,
      updatedUser.imageBase64 ?? undefined
    );
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map(
      (user) =>
        new User(
          user.id,
          user.email,
          user.username,
          user.password,
          user.imageBase64 ?? undefined
        )
    );
  }
}