import { Express, Request, Response } from 'express';
import { UserService } from '../../services/userService';

export class UserController {
	private service_user: UserService;

	constructor(private readonly userService: UserService) {
		this.service_user = userService;
	}

	registerRoutes(app: Express) {
		app.get('/user/:id', this.getUser.bind(this));
		app.post('/user', this.createUser.bind(this));
	}

	async getUser(req: Request, res: Response) {
		const id = Number(req.params.id);
		const usage_user = await this.service_user.getUser(id);
		if (!usage_user) return res.status(404).json({ message: 'Not found' });
		res.json(usage_user);
	}

	async createUser(req: Request, res: Response) {
		const user = await this.service_user.createUser(req.body);
		res.json(user);
	}
}