import { User } from '../../domain/user';
import { UserRepositoryPort } from '../../ports/driven/userRepositoryPort';
import pool from './db';

export class UserRepo implements UserRepositoryPort {
	async findById(id: number): Promise<User | null> {
		const res = await pool.query(
			`
			SELECT
				id,
				name,
				password
			FROM users
			WHERE id = $1
			`,
			[id]
		);

		return res.rows[0] ?? null;
	}

	async findByName(name: string): Promise<User | null> {
		const res = await pool.query(
			`
			SELECT
				id,
				name,
				password
			FROM users
			WHERE name = $1 
			`,
			[name]
		);

		return res.rows[0] ?? null;
	}

  	async save(user: Omit<User, 'id'>): Promise<User> {
		const res = await pool.query(
			`
			INSERT INTO users (
				name,
				password
			)
			VALUES ($1, $2)
			RETURNING
				id,
				name
			`,
			[
				user.name,
				user.password
			]
		);

		return res.rows[0];
  	}
}
