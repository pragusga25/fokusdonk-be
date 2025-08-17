import { SubmissionRepo } from '.';
import { cache } from '../../../cache';
import db from '../../../db';
import { getUTCTodayDate } from '../../../utils/date';

export class PrismaPgSubmissionRepo implements SubmissionRepo {
  async create(params: ICreateSubmissionParams): Promise<Submission> {
    const submission = await db.$transaction(async (tx) => {
      const submissionPromise = tx.submission.create({
        data: params,
      });

      const updateProfilePromise = tx.user.update({
        where: { id: params.userId },
        data: {
          totalXP: params.totalXP,
          currentStreak: params.currentStreak,
          bestStreak: params.bestStreak,
          lastActivityDate: getUTCTodayDate(),
        },
      });

      const userProgressPromise = tx.userProgress.findUnique({
        where: {
          user_lesson_unique: {
            userId: params.userId,
            lessonId: params.lessonId,
          },
        },
      });

      await cache.del(
        `lesson:countLessonsAndProblemsByUserId:${params.userId}`,
        `lesson:list:${params.userId}`
      );

      const [submission, userProgress] = await Promise.all([
        submissionPromise,
        userProgressPromise,
        updateProfilePromise,
      ]);

      if (userProgress) {
        await tx.userProgress.update({
          where: {
            user_lesson_unique: {
              userId: params.userId,
              lessonId: params.lessonId,
            },
          },
          data: {
            bestCorrectCount: Math.max(
              userProgress.bestCorrectCount,
              params.correctCount
            ),
            totalAttempts: userProgress.totalAttempts + 1,
            totalXP: BigInt(userProgress.totalXP) + BigInt(params.totalXP),
            completedAt:
              params.totalProblems === params.correctCount ? new Date() : null,
          },
        });
      } else {
        await tx.userProgress.create({
          data: {
            userId: params.userId,
            lessonId: params.lessonId,
            bestCorrectCount: params.correctCount,
            totalAttempts: 1,
            totalXP: params.totalXP,
            completedAt:
              params.totalProblems === params.correctCount ? new Date() : null,
          },
        });
      }

      return submission;
    });

    return submission;
  }

  async getByIdAndUserId(
    id: string,
    userId: bigint
  ): Promise<Submission | null> {
    return db.submission.findFirst({
      where: {
        id,
        userId,
      },
    });
  }
}
