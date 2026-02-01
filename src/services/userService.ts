import { User } from '../domain/user';
import { UserRepositoryPort } from '../ports/driven/userRepositoryPort';
import { UserPort } from "../ports/driving/userPort";
import bcrypt from "bcrypt";

export class UserService implements UserPort {
  	constructor(private repo: UserRepositoryPort) {}

	async getUser(id: number): Promise<User | null>{
		return this.repo.findById(id);
	}
  
	  async createUser(input: Omit<User, 'id'>): Promise<User> {
		const isUsernameValid = await this.checkUsername(input);
		if (!isUsernameValid) {
			throw new Error('Username already exists');
		}
		const isPasswordValid = this.checkPassword(input);
		if (!isPasswordValid) {
			throw new Error('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
		}
		const hashedPassword = await bcrypt.hash(input.password!, 10);
		input.password = hashedPassword;

		return this.repo.save(input);
	}

	async checkUsername(input: Omit<User, 'id'>): Promise<Boolean> {
		const existingUser = await this.repo.findByName(input.name);
		return existingUser === null;
	};

	checkPassword(input: Omit<User, 'id'>): boolean {
		const password: string = input.password!;

		const minLength = 8;
		const hasUppercase = /[A-Z]/.test(password);
		const hasLowercase = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>/]/.test(password);

		return (
			password.length >= minLength &&
			hasUppercase &&
			hasLowercase &&
			hasNumber &&
			hasSpecialChar
		);
	}
}
