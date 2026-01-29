import { UserService } from '../../services/userService';
import { User } from '../../domain/user';

type MockUserRepository = {
    findById: jest.Mock<Promise<User | null>, [number]>;
    save: jest.Mock<Promise<User | null>, [number]>;
};

const createMockRepo = (): MockUserRepository => ({
    findById: jest.fn(),
    save: jest.fn()
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
        it('save a user', async () => {
            const user: User = {
                id: 1,
                name: 'Bob',
                password: 'password123'
            };

            repo.save.mockResolvedValue(user);

            const result = await service.createUser(user);

            expect(result).toEqual(user);
            expect(repo.save).toHaveBeenCalledTimes(1);
            expect(repo.save).toHaveBeenCalledWith(user);
        });
    });
});
