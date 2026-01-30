import { User } from '../../domain/user';

export interface UserRepositoryPort {
  findById(id: number): Promise<User | null>;
  save(input: Omit<User, 'id'>): Promise<User>;
}