import {
  IListLessonsParams,
  LessonWithProgress,
  LessonWithProblemsAndOptions,
  LessonWithProblemsAndCorrectAnswers,
  LessonCounts,
} from '../interfaces';
import { PrismaPgLessonRepo } from './prisma-pg';

export interface LessonRepo {
  list(params: IListLessonsParams): Promise<LessonWithProgress[]>;
  getWithProblemsAndOptions(
    lessonId: string
  ): Promise<LessonWithProblemsAndOptions | null>;
  getWithProblemsAndCorrectAnswers(
    lessonId: string
  ): Promise<LessonWithProblemsAndCorrectAnswers | null>;
  countLessonsAndProblemsByUserId(userId: bigint): Promise<LessonCounts>;
}

const lessonRepo: LessonRepo = new PrismaPgLessonRepo();

export { lessonRepo };
