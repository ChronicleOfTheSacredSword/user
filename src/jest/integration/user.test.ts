import { UserService } from '../../services/userService';
import { User } from '../../domain/user';
import { UserRepo } from '../../adapters/driven/userRepo';
import pool from '../../adapters/driven/db';


describe('UserService', () => {
    let repo_user: UserRepo;
    let service: UserService;

    beforeEach(() => {
        repo_user = new UserRepo();
        service = new UserService(repo_user);
    });

    describe('set & get user', () => {

        it('create & get a user in the database', async () => {
            const user: User = {
                name: 'John',
                password: 'Password'
            }

            const new_user: User = await service.createUser(user);

            expect(new_user.id).toBeDefined();
            expect(new_user.password).toBeUndefined();

            const get_user: User | null = await service.getUser(new_user.id!);
            expect(get_user!.id).toEqual(new_user.id);
            expect(get_user!.name).toEqual(new_user.name);
        });
    });
});

afterAll(async () => {
    await pool.end();
});
