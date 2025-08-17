import { AppCache, cache } from '../../cache';
import { isToday, isYesterday } from '../../utils/date';
import { ProfileNotFoundError } from '../profile/errors';
import { profileRepo, ProfileRepo } from '../profile/repo';
import { submissionRepo, SubmissionRepo } from '../submission/repo';
import {
  LessonNotFoundError,
  ProblemAnswerInvalidError,
  ProblemIdInvalidError,
} from './errors';
import {
  IListLessonsParams,
  LessonWithProblemsAndCorrectAnswers,
} from './interfaces';
import { lessonRepo, LessonRepo } from './repo';
import {
  LessonDetail,
  LessonList,
  SubmitBody,
  SubmitResponse,
} from './validations';

const CACHE_EX_SECONDS = 60 * 3; // 3 minutes

class LessonService {
  constructor(
    private readonly lessonRepo: LessonRepo,
    private readonly submissionRepo: SubmissionRepo,
    private readonly profileRepo: ProfileRepo,
    private readonly cache: AppCache
  ) {}

  async listLessons(params: IListLessonsParams): Promise<LessonList> {
    const cacheKey = `lesson:list:${params.userId}`;
    const cachedLessons = await this.cache.get(cacheKey);
    if (cachedLessons) {
      return JSON.parse(cachedLessons) as LessonList;
    }

    const lessons = await this.lessonRepo.list(params);

    await this.cache.setEx(cacheKey, JSON.stringify(lessons), CACHE_EX_SECONDS);

    return lessons;
  }

  async getLessonDetail(lessonId: string): Promise<LessonDetail> {
    const cacheKey = `lesson:detail:${lessonId}`;
    const cachedLesson = await this.cache.get(cacheKey);
    if (cachedLesson) {
      return JSON.parse(cachedLesson) as LessonDetail;
    }

    const lesson = await this.lessonRepo.getWithProblemsAndOptions(lessonId);

    if (!lesson) throw new LessonNotFoundError(lessonId);

    await this.cache.setEx(cacheKey, JSON.stringify(lesson), CACHE_EX_SECONDS);

    return lesson;
  }

  async submit(
    params: SubmitBody & { lessonId: string; userId: bigint }
  ): Promise<SubmitResponse> {
    const { lessonId, userId, answers, attemptId } = params;
    const submissionKey = `lesson:submission:${userId}:${lessonId}:${attemptId}`;
    const cachedSubmission = await this.cache.get(submissionKey);

    if (cachedSubmission) {
      return JSON.parse(cachedSubmission) as SubmitResponse;
    }

    const lessonKey = `lesson:problems-answers:${lessonId}`;

    const cachedLesson = await this.cache.get(lessonKey);

    const lesson = cachedLesson
      ? (JSON.parse(cachedLesson) as LessonWithProblemsAndCorrectAnswers)
      : await this.lessonRepo.getWithProblemsAndCorrectAnswers(lessonId);

    if (!lesson) throw new LessonNotFoundError(lessonId);

    const submission = await this.submissionRepo.getByIdAndUserId(
      attemptId,
      userId
    );

    if (submission) {
      const ret = {
        correctCount: submission.correctCount,
        earnedXP: submission.earnedXP,
        newTotalXP: submission.totalXP,
        streak: {
          current: submission.currentStreak,
          best: submission.bestStreak,
        },
        lessonProgress:
          submission.totalProblems > 0
            ? submission.correctCount / submission.totalProblems
            : 0,
        totalProblems: submission.totalProblems,
      };

      await this.cache.setEx(
        submissionKey,
        JSON.stringify(ret),
        CACHE_EX_SECONDS
      );
      return ret;
    }

    const profile = await this.profileRepo.getByUserId(userId);
    if (!profile) throw new ProfileNotFoundError(userId);

    let { currentStreak, bestStreak, lastActivityDate, totalXP } = profile;

    if (!lastActivityDate || isYesterday(lastActivityDate)) {
      // if lastActivityDate is null, it means the user has never submitted before
      currentStreak += 1;
      bestStreak = Math.max(currentStreak, bestStreak);
    } else if (!isToday(lastActivityDate)) {
      // if lastActivityDate is not today and not yesterday, reset the streak
      currentStreak = 1;
    }

    const problemIdsCounted = new Set<string>();

    const { correctCount, earnedXP } = answers.reduce(
      (acc, answer) => {
        if (problemIdsCounted.has(answer.problemId)) {
          // Skip already counted problems to avoid double counting
          return acc;
        }

        const problem = lesson.problems.find((p) => p.id === answer.problemId);
        if (!problem) throw new ProblemIdInvalidError(answer.problemId);

        let isCorrect = false;
        const problemType = problem.type;

        if (problemType === 'MULTIPLE_CHOICE') {
          if (!('optionId' in answer))
            throw new ProblemAnswerInvalidError(
              problem.id,
              problemType,
              'optionId'
            );

          isCorrect = problem.correctOptionId === answer.optionId;
        }

        if (problemType === 'INPUT') {
          if (!('value' in answer))
            throw new ProblemAnswerInvalidError(
              problem.id,
              problemType,
              'value'
            );

          isCorrect = problem.correctAnswer === answer.value;
        }

        if (isCorrect) {
          acc.correctCount += 1;
          acc.earnedXP += problem.xp;
        }

        problemIdsCounted.add(problem.id);

        return acc;
      },
      { correctCount: 0, earnedXP: 0 }
    );

    const totalProblems = lesson.problems.length;

    const newTotalXP = totalXP + earnedXP;

    const submissionResult = await this.submissionRepo.create({
      id: attemptId,
      userId,
      totalXP: newTotalXP,
      earnedXP,
      lessonId,
      totalProblems,
      correctCount,
      bestStreak,
      currentStreak,
    });

    const ret = {
      correctCount: submissionResult.correctCount,
      earnedXP: submissionResult.earnedXP,
      newTotalXP: submissionResult.totalXP,
      streak: {
        current: submissionResult.currentStreak,
        best: submissionResult.bestStreak,
      },
      lessonProgress:
        totalProblems > 0 ? submissionResult.correctCount / totalProblems : 0,
      totalProblems: submissionResult.totalProblems,
    };

    await this.cache.setEx(
      submissionKey,
      JSON.stringify(ret),
      CACHE_EX_SECONDS
    );

    return ret;
  }
}

export const lessonService = new LessonService(
  lessonRepo,
  submissionRepo,
  profileRepo,
  cache
);
