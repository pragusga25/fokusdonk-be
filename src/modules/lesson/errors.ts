import { BaseError } from '../../utils/error';

export class LessonNotFoundError extends BaseError {
  constructor(lessonId: string) {
    super(`Lesson with ID ${lessonId} not found`, 404);
    this.name = 'LessonNotFoundError';
  }
}

export class ProblemIdInvalidError extends BaseError {
  constructor(problemId: string) {
    super(`Problem with ID ${problemId} is invalid`, 422);
    this.name = 'ProblemIdInvalidError';
  }
}

export class ProblemAnswerInvalidError extends BaseError {
  constructor(
    problemId: string,
    problemType: 'MULTIPLE_CHOICE' | 'INPUT',
    answerKey: 'optionId' | 'value'
  ) {
    super(
      `Answer for problem ID ${problemId} with type ${problemType} must include ${answerKey}`,
      422
    );
    this.name = 'ProblemAnswerInvalidError';
  }
}
