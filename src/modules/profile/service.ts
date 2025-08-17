import { lessonRepo, LessonRepo } from '../lesson/repo';
import { ProfileNotFoundError } from './errors';
import { IProfileResult } from './interfaces';
import { profileRepo, ProfileRepo } from './repo';

class ProfileService {
  constructor(
    private readonly profileRepo: ProfileRepo,
    private readonly lessonRepo: LessonRepo
  ) {}

  async getProfile(userId: bigint): Promise<IProfileResult> {
    const profile = await this.profileRepo.getByUserId(userId);

    if (!profile) throw new ProfileNotFoundError(userId);

    const { lastActivityDate, ...rest } = profile;

    const lessonCounts = await this.lessonRepo.countLessonsAndProblemsByUserId(
      userId
    );

    const progress =
      lessonCounts.totalProblems !== 0
        ? lessonCounts.answeredProblems / lessonCounts.totalProblems
        : 0;

    return {
      ...rest,
      lessonCompleted: lessonCounts.completed,
      lessonInProgress: lessonCounts.inProgress,
      lessonNotStarted: lessonCounts.notStarted,
      level: this.calculateLevel(profile.totalXP),
      progress: Number(progress.toFixed(2)),
    };
  }

  /**
   * Simple progressive level calculation
   * Level 1: 0-499 XP
   * Level 2: 500-1199 XP
   * Level 3: 1200-2099 XP
   * Level 4: 2100-3299 XP
   * And so on...
   */
  private calculateLevel(totalXP: number): number {
    if (totalXP < 0) return 1;

    // Simple formula: level = sqrt(totalXP / 100) + 1
    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;

    return Math.max(level, 1);
  }
}

export const profileService = new ProfileService(profileRepo, lessonRepo);
