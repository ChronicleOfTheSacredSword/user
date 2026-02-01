import { User } from '../../domain/user';
export interface UserPort {;
  getUser(id: number): Promise<User | null>;
  createUser(input: Omit<User, 'id'>): Promise<User>;
  checkUsername(input: Omit<User, 'id'>): Promise<Boolean>;
  checkPassword(input: Omit<User, 'id'>): Boolean;
}