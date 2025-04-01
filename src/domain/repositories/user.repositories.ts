import { User } from '../entities/user.entities';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  deleteById(id: number): Promise<void>;
}