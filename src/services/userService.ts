import { User } from '../domain/user';
import { UserRepositoryPort } from '../ports/driven/userRepositoryPort';
import { UserPort } from "../ports/driving/userPort";
import bcrypt from "bcrypt";

export class UserService implements UserPort {
  	constructor(private repo: UserRepositoryPort) {}

	async getUser(id: number): Promise<User | null>{
		return this.repo.findById(id);
	}
  
	async createUser(input: Omit<User, 'id'>): Promise<User>{
		const hashedPassword = await bcrypt.hash(input.password!, 10);
		input.password = hashedPassword;
		return this.repo.save(input);
	}
}
