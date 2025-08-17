import { Profile } from '../interfaces';
import { ProfileRepo } from '.';
import db from '../../../db';

export class PrismaPgProfileRepo implements ProfileRepo {
  updateXPStreakByUserId(
    userId: bigint,
    xp: number,
    streak: number,
    bestStreak: number
  ): Promise<Profile> {
    throw new Error('Method not implemented.');
  }

  async getByUserId(userId: bigint): Promise<Profile | null> {
    // Implementation to fetch profile details by user ID
    return await db.user.findUnique({
      where: { id: userId },
      select: {
        currentStreak: true,
        bestStreak: true,
        totalXP: true,
        lastActivityDate: true,
      },
    });
  }
}
