import { User } from '../../domain/user';
import { UserRepositoryPort } from '../../ports/driven/userRepositoryPort';
import pool from './db';

export class UserRepo implements UserRepositoryPort {
	async findById(id: number): Promise<User | null> {
		const res = await pool.query(
			`
			SELECT
				k_id AS id,
				name,
				lastname,
				email,
				phone,
				birthdate
			FROM user_account
			WHERE k_id = $1
			`,
			[id]
		);

		return res.rows[0] ?? null;
	}

  	async save(user: Omit<User, 'id'>): Promise<User> {
		const res = await pool.query(
			`
			INSERT INTO user_account (
				name,
				password
			)
			VALUES ($1, $2)
			RETURNING
				k_id AS id,
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
