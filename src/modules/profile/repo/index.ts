import { Profile } from '../interfaces';
import { PrismaPgProfileRepo } from './prisma-pg';

export interface ProfileRepo {
  getByUserId(userId: bigint): Promise<Profile | null>;
}

const profileRepo: ProfileRepo = new PrismaPgProfileRepo();

export { profileRepo };
