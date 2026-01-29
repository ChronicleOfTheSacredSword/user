import { UserService } from '../../services/userService';
import { User } from '../../domain/user';
import { UserRepo } from '../../adapters/driven/userRepo';

let compare_users = (old_user: User | null, new_user: User | null) => {
    expect(new_user).not.toBeNull();
    expect(new_user?.name).toEqual(old_user?.name);
    expect(new_user?.password).toEqual(old_user?.password);
}

describe('UserService', () => {
    let repo_user: UserRepo;
    let service: UserService;

    beforeEach(() => {
        repo_user = new UserRepo();
        service = new UserService(repo_user);
    });

    describe('getUser', () => {

        it('create & get a user in the database', async () => {
            const user: User = {
                name: 'John',
                lastname: 'Doe',
                email: 'john@test.com',
                phone: '0123456789',
                birthdate: new Date('2000-01-01'),
            }

            const new_user: User = await service.createUser(user);

            expect(new_user.id).toBeDefined();
            
            const result = await service.getUser(new_user.id!);

            compare_users(result, user);

            const updated_user: User = {
                id: new_user.id,
                name: 'Pascal',
                lastname: 'Laroche',
                email: 'pascal@test.com',
                phone: '0123456987',
                birthdate: new Date('2002-02-02'),
            }

            const result_updated = await service.updateUser(updated_user);

            compare_users(result_updated, updated_user);

            await service.deleteUser(new_user.id!);

            // Verify deletion
            const result_after_delete = await service.getUser(new_user.id!);
            expect(result_after_delete).toBeNull();
        });
    });
});
