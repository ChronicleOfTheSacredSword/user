import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { UserRepo } from './adapters/driven/userRepo';
import { UserService } from './services/userService';
import { UserController } from './adapters/driving/userController';


dotenv.config();

const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:9000' }));

const PORT = process.env.PORT || 5000;

app.use(express.json());

const repo_user = new UserRepo();
const user_service = new UserService(repo_user);
const user_controller = new UserController(user_service);

// Test route
app.get('/debug', (req: Request, res: Response) => {
	res.send('API is running');
});

user_controller.registerRoutes(app);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
