import db from '../../../db';
import {
  IListLessonsParams,
  LessonCounts,
  LessonWithProblemsAndCorrectAnswers,
  LessonWithProblemsAndOptions,
  LessonWithProgress,
} from '../interfaces';
import { LessonRepo } from '.';

export class PrismaPgLessonRepo implements LessonRepo {
  async getWithProblemsAndCorrectAnswers(
    lessonId: string
  ): Promise<LessonWithProblemsAndCorrectAnswers | null> {
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        title: true,
        description: true,
        problems: {
          select: {
            id: true,
            type: true,
            xp: true,
            problemOptions: {
              select: { id: true },
              where: { isCorrect: true },
              take: 1,
            },
            problemAnswer: {
              select: { answer: true },
            },
          },
        },
      },
    });

    if (!lesson) return null;

    const ret = {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      problems: lesson.problems.map((problem) => ({
        id: problem.id,
        type: problem.type,
        xp: problem.xp,
        correctOptionId:
          problem.type === 'MULTIPLE_CHOICE' && problem.problemOptions.length
            ? problem.problemOptions[0].id
            : null,
        correctAnswer:
          problem.type === 'INPUT'
            ? problem.problemAnswer?.answer || null
            : null,
      })),
    };

    return ret;
  }

  async getWithProblemsAndOptions(
    lessonId: string
  ): Promise<LessonWithProblemsAndOptions | null> {
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        title: true,
        description: true,
        problems: {
          select: {
            id: true,
            question: true,
            type: true,
            problemOptions: {
              select: {
                id: true,
                option: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!lesson) return null;

    const ret = {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      problems: lesson.problems.map((problem) => ({
        id: problem.id,
        question: problem.question,
        type: problem.type,
        options: problem.problemOptions.map((option) => ({
          id: option.id,
          option: option.option,
        })),
      })),
    };

    return ret;
  }

  async list({ userId }: IListLessonsParams): Promise<LessonWithProgress[]> {
    const lessons = await db.lesson.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        _count: {
          select: { problems: true },
        },
        userProgresses: {
          where: { userId },
          select: { bestCorrectCount: true },
        },
      },
    });

    const ret = lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      progress: lesson.userProgresses.length
        ? lesson.userProgresses[0].bestCorrectCount / lesson._count.problems
        : 0,
    }));

    return ret;
  }

  async countLessonsAndProblemsByUserId(userId: bigint): Promise<LessonCounts> {
    const [lessonTotal, totalProblems, userProgresses] = await Promise.all([
      db.lesson.count(),
      db.problem.count(),
      db.userProgress.findMany({
        where: { userId },
        select: {
          completedAt: true,
          bestCorrectCount: true,
          lessonId: true,
        },
      }),
    ]);

    const total = lessonTotal;
    let [completed, inProgress, answeredProblems] = [0, 0, 0];

    userProgresses.forEach((progress) => {
      if (progress.completedAt) {
        completed++;
      } else {
        inProgress++;
      }
      answeredProblems += progress.bestCorrectCount;
    });

    const ret = {
      total,
      completed,
      inProgress,
      notStarted: total - (completed + inProgress),
      answeredProblems,
      totalProblems,
    };

    return ret;
  }
}
