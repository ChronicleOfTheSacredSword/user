import { UserService } from '../../services/userService';
import { User } from '../../domain/user';

type MockUserRepository = {
    findById: jest.Mock<Promise<User | null>, [number]>;
    save: jest.Mock<Promise<User | null>, [number]>;
    findByName: jest.Mock<Promise<User | null>, [number]>;
};

const createMockRepo = (): MockUserRepository => ({
    findById: jest.fn(),
    save: jest.fn(),
    findByName: jest.fn()
});

describe('UserService', () => {
    let repo: MockUserRepository;
    let service: UserService;

    beforeEach(() => {
        repo = createMockRepo();
        service = new UserService(repo as any);
    });

    describe('getUser', () => {
        it('returns a user by id', async () => {
            const user: User = {
                id: 1,
                name: 'John',
                password: 'Doe',
            };

            repo.findById.mockResolvedValue(user);

            const result = await service.getUser(1);

            expect(result).toEqual(user);
            expect(repo.findById).toHaveBeenCalledWith(1);
            expect(repo.findById).toHaveBeenCalledTimes(1);
        });
    });

    describe('saveUser', () => {
        it('create a user', async () => {
            const user: User = {
                id: 1,
                name: 'Bob',
                password: 'Password123//'
            };

            repo.save.mockResolvedValue(user);
            repo.findByName.mockResolvedValue(null);

            const result = await service.createUser(user);

            expect(result).toEqual(user);
            expect(repo.save).toHaveBeenCalledTimes(1);
            expect(repo.save).toHaveBeenCalledWith(user);
            expect(repo.findByName).toHaveBeenCalledTimes(1);
            expect(repo.findByName).toHaveBeenCalledWith(user.name);
        });

        it('create an existing user', async () => {
            const user: User = {
                id: 1,
                name: 'Bob',
                password: 'Password123//'
            };

            repo.save.mockResolvedValue(user);
            repo.findByName.mockResolvedValue(user);

            await expect(service.createUser(user)).rejects.toThrow();
            
            //expect throw error
            expect(repo.findByName).toHaveBeenCalledTimes(1);
            expect(repo.findByName).toHaveBeenCalledWith(user.name);
        });

        it('check password - no uppercase', async () => {
            const user: User = {
                id: 1,
                name: 'Bob',
                password: 'password123/'
            };
            const result = service.checkPassword(user);
            expect(result).toBeFalsy();
        });

        it('check password - no special', async () => {
            const user: User = {
                id: 1,
                name: 'Bob',
                password: 'Password123'
            };
            const result = service.checkPassword(user);
            expect(result).toBeFalsy();
        });

        it('check password - no lowercase', async () => {
            const user: User = {
                id: 1,
                name: 'Bob',
                password: 'PASSWORD123/'
            };
            const result = service.checkPassword(user);
            expect(result).toBeFalsy();
        });

        it('check password - no number', async () => {
            const user: User = {
                id: 1,
                name: 'Bob',
                password: 'Password/'
            };
            const result = service.checkPassword(user);
            expect(result).toBeFalsy();
        });
    });
});
