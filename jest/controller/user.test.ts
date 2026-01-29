// __tests__/userController.test.ts
import { Request, Response } from 'express';
import { UserController } from '../../adapters/driving/userController';
import { UserService } from '../../services/userService';
import { User } from '../../domain/user';

describe('UserController', () => {
    let userService: jest.Mocked<UserService>;
    let controller: UserController;
    let res: Partial<Response>;

    beforeEach(() => {
        userService = {
            getUser: jest.fn(),
            createUser: jest.fn()
        } as unknown as jest.Mocked<UserService>;

        controller = new UserController(userService);

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });


    describe('getUser', () => {
        it('should return a user when found', async () => {
            const user:User = { 
                id: 1,
                name: 'John'
            };
            userService.getUser.mockResolvedValue(user);

            const req = { params: { id: '1' } } as Partial<Request>;

            await controller.getUser(req as Request, res as Response);

            expect(userService.getUser).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it('should return 404 if user not found', async () => {
            userService.getUser.mockResolvedValue(null);

            const req = { params: { id: '1' } } as Partial<Request>;

            await controller.getUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
        });
    });

    describe('createUser', () => {
        it('should create a user', async () => {
            const user:User = {
                name: 'John',
                password:'password123'
            }
            userService.createUser.mockResolvedValue(user);

            const req = { body: user } as Partial<Request>;

            await controller.createUser(req as Request, res as Response);

            expect(userService.createUser).toHaveBeenCalledWith(user);
            expect(res.json).toHaveBeenCalledWith(user);
        });
    });
});
