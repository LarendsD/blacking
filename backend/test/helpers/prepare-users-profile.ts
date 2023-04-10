import { UserProfile } from '../../src/users-profile/entities/user-profile.entity';
import { User } from '../../src/users/entities/user.entity';
import { Repository } from 'typeorm';

export const prepareUsersWithProfiles = async (
  usersRepo: Repository<User>,
  userData: Array<Record<string, unknown>>,
  profileData: Array<Record<string, unknown>>,
): Promise<UserProfile[]> => {
  return usersRepo.manager.transaction(async (transaction) => {
    return Promise.all(
      userData.map(async (user, index) => {
        const createdUser = transaction.create(User, user);
        await transaction.save(createdUser);
        const createdProfile = transaction.create(
          UserProfile,
          profileData[index],
        );

        createdProfile.user = createdUser;
        await transaction.save(createdProfile);

        return createdProfile;
      }),
    );
  });
};
