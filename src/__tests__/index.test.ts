import { describe, expect, it } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { app } from '..';
import { SEED_DATA } from '../db/data';
import db from '../db';
import { USER_ID } from '../constants';
import { changeTodayDateByDays } from '../utils/date';

const ty = treaty(app);
const PROFILE = {
  bestStreak: 0,
  currentStreak: 0,
  totalXP: 0,
  lessonCompleted: 0,
  lessonInProgress: 0,
  lessonNotStarted: SEED_DATA.LESSONS.length,
  progress: 0, // problems answered / total problems
};

const ATTEMP_ID = crypto.randomUUID();
const TOTAL_PROBLEMS = SEED_DATA.LESSONS.reduce(
  (acc, lesson) => acc + lesson.PROBLEMS.length,
  0
);

describe('FokusDonk Tests: Cover All Scenarios', () => {
  it('check the initial profile', async () => {
    // Test the initial profile
    const initProfileResult = await ty.api.profile.get();
    expect(initProfileResult.data).toBeDefined();
    expect(initProfileResult.data).toEqual(expect.objectContaining(PROFILE));
  });

  it('should return all lessons with no progress', async () => {
    // Fetch all lessons
    const lessonsResult = await ty.api.lessons.get();
    expect(lessonsResult.data).toBeDefined();
    expect(lessonsResult.data).toEqual(
      expect.arrayContaining(
        SEED_DATA.LESSONS.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          id: lesson.id,
          progress: 0,
        }))
      )
    );
  });

  it('should successfully submit a submission at first time ever', async () => {
    // Submit a submission
    const submissionResult = await ty.api
      .lessons({
        lessonId: SEED_DATA.LESSONS[0].id,
      })
      .submit.post({
        attemptId: ATTEMP_ID,
        answers: SEED_DATA.LESSONS[0].PROBLEMS.map((problem) => {
          if (problem.PROBLEM_ANSWER) {
            return {
              problemId: problem.id,
              value: problem.PROBLEM_ANSWER.answer,
            };
          }
          return {
            problemId: problem.id,
            optionId:
              problem.PROBLEM_OPTIONS.find((option) => option.isCorrect)?.id ||
              problem.PROBLEM_OPTIONS[0].id,
          };
        }),
      });

    expect(submissionResult.data).toBeDefined();
    PROFILE.totalXP += SEED_DATA.LESSONS[0].PROBLEMS.reduce(
      (acc, problem) => acc + problem.xp,
      0
    );
    PROFILE.lessonCompleted += 1;
    PROFILE.lessonNotStarted -= 1;
    PROFILE.currentStreak += 1;
    PROFILE.bestStreak = Math.max(PROFILE.bestStreak, PROFILE.currentStreak);
    PROFILE.progress = Number(
      (SEED_DATA.LESSONS[0].PROBLEMS.length / TOTAL_PROBLEMS).toFixed(2)
    );
    expect(submissionResult.data).toEqual(
      expect.objectContaining({
        correctCount: SEED_DATA.LESSONS[0].PROBLEMS.length,
        earnedXP: PROFILE.totalXP,
        newTotalXP: PROFILE.totalXP,
        streak: {
          current: 1,
          best: 1,
        },
        lessonProgress: 1,
      })
    );
  });

  it('should return the profile with updated values after submission', async () => {
    // Check the profile after submission
    const profileResult = await ty.api.profile.get();
    expect(profileResult.data).toBeDefined();
    expect(profileResult.data).toEqual(expect.objectContaining(PROFILE));
  });

  it('should return the updated lessons with progress after submission', async () => {
    // Fetch all lessons after submission
    const lessonsResult = await ty.api.lessons.get();
    expect(lessonsResult.data).toBeDefined();
    expect(lessonsResult.data).toEqual(
      expect.arrayContaining(
        SEED_DATA.LESSONS.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          id: lesson.id,
          progress: lesson.id === SEED_DATA.LESSONS[0].id ? 1 : 0,
        }))
      )
    );
  });

  it('should not increase streak and should return identical response when submit a submisstion with the same attempId', async () => {
    // Submit the same submission again
    const submissionResult = await ty.api
      .lessons({
        lessonId: SEED_DATA.LESSONS[0].id,
      })
      .submit.post({
        attemptId: ATTEMP_ID,
        answers: SEED_DATA.LESSONS[0].PROBLEMS.map((problem) => {
          if (problem.PROBLEM_ANSWER) {
            return {
              problemId: problem.id,
              value: problem.PROBLEM_ANSWER.answer,
            };
          }
          return {
            problemId: problem.id,
            optionId:
              problem.PROBLEM_OPTIONS.find((option) => option.isCorrect)?.id ||
              problem.PROBLEM_OPTIONS[0].id,
          };
        }),
      });

    expect(submissionResult.data).toBeDefined();
    expect(submissionResult.data).toEqual(
      expect.objectContaining({
        correctCount: SEED_DATA.LESSONS[0].PROBLEMS.length,
        earnedXP: SEED_DATA.LESSONS[0].PROBLEMS.reduce(
          (acc, problem) => acc + problem.xp,
          0
        ),
        newTotalXP: PROFILE.totalXP,
        streak: {
          current: 1,
          best: 1,
        },
        lessonProgress: 1,
      })
    );

    const profileResult = await ty.api.profile.get();
    expect(profileResult.data).toBeDefined();
    expect(profileResult.data).toEqual(expect.objectContaining(PROFILE));
  });

  it('should not increase streak when submitting a submission with a different attemptId in the same day', async () => {
    // Submit a submission with a different attemptId
    const newAttemptId = crypto.randomUUID();
    const submissionResult = await ty.api
      .lessons({
        lessonId: SEED_DATA.LESSONS[1].id,
      })
      .submit.post({
        attemptId: newAttemptId,
        answers: SEED_DATA.LESSONS[1].PROBLEMS.map((problem) => {
          if (problem.PROBLEM_ANSWER) {
            return {
              problemId: problem.id,
              value: problem.PROBLEM_ANSWER.answer,
            };
          }
          return {
            problemId: problem.id,
            optionId:
              problem.PROBLEM_OPTIONS.find((option) => option.isCorrect)?.id ||
              problem.PROBLEM_OPTIONS[0].id,
          };
        }),
      });

    expect(submissionResult.data).toBeDefined();
    const earnedXP = SEED_DATA.LESSONS[1].PROBLEMS.reduce(
      (acc, problem) => acc + problem.xp,
      0
    );
    PROFILE.totalXP += earnedXP;
    PROFILE.lessonCompleted += 1;
    PROFILE.lessonNotStarted -= 1;
    PROFILE.progress = Number(
      (
        (SEED_DATA.LESSONS[0].PROBLEMS.length +
          SEED_DATA.LESSONS[1].PROBLEMS.length) /
        TOTAL_PROBLEMS
      ).toFixed(2)
    );
    expect(submissionResult.data).toEqual(
      expect.objectContaining({
        correctCount: SEED_DATA.LESSONS[1].PROBLEMS.length,
        earnedXP,
        newTotalXP: PROFILE.totalXP,
        streak: {
          current: 1,
          best: 1,
        },
        lessonProgress: 1,
      })
    );
  });

  it('should return the profile with updated values after second submission', async () => {
    // Check the profile after second submission
    const profileResult = await ty.api.profile.get();
    expect(profileResult.data).toBeDefined();
    expect(profileResult.data).toEqual(expect.objectContaining(PROFILE));
  });

  it('should increase streak when lastActivityDate is yesterday and submit a new submission', async () => {
    await db.user.update({
      where: { id: USER_ID },
      data: {
        lastActivityDate: changeTodayDateByDays(-1),
      },
    });

    const newAttemptId = crypto.randomUUID();
    const submissionResult = await ty.api
      .lessons({
        lessonId: SEED_DATA.LESSONS[2].id,
      })
      .submit.post({
        attemptId: newAttemptId,
        answers: SEED_DATA.LESSONS[2].PROBLEMS.map((problem) => {
          if (problem.PROBLEM_ANSWER) {
            return {
              problemId: problem.id,
              value: problem.PROBLEM_ANSWER.answer,
            };
          }
          return {
            problemId: problem.id,
            optionId:
              problem.PROBLEM_OPTIONS.find((option) => option.isCorrect)?.id ||
              problem.PROBLEM_OPTIONS[0].id,
          };
        }),
      });

    expect(submissionResult.data).toBeDefined();
    const earnedXP = SEED_DATA.LESSONS[2].PROBLEMS.reduce(
      (acc, problem) => acc + problem.xp,
      0
    );

    PROFILE.totalXP += earnedXP;
    PROFILE.lessonCompleted += 1;
    PROFILE.lessonNotStarted -= 1;
    PROFILE.currentStreak += 1;
    PROFILE.bestStreak = Math.max(PROFILE.bestStreak, PROFILE.currentStreak);
    PROFILE.progress = 1; // All problems completed
    expect(submissionResult.data).toEqual(
      expect.objectContaining({
        correctCount: SEED_DATA.LESSONS[2].PROBLEMS.length,
        earnedXP,
        newTotalXP: PROFILE.totalXP,
        streak: {
          current: PROFILE.currentStreak,
          best: PROFILE.bestStreak,
        },
        lessonProgress: 1,
      })
    );
  });

  it('should reset streak to 1 when lastActiivityDate is more than 1 day ago and submit a new submission', async () => {
    await db.user.update({
      where: { id: USER_ID },
      data: {
        lastActivityDate: changeTodayDateByDays(-2),
      },
    });

    const newAttemptId = crypto.randomUUID();
    const submissionResult = await ty.api
      .lessons({
        lessonId: SEED_DATA.LESSONS[0].id,
      })
      .submit.post({
        attemptId: newAttemptId,
        answers: SEED_DATA.LESSONS[0].PROBLEMS.map((problem) => {
          if (problem.PROBLEM_ANSWER) {
            return {
              problemId: problem.id,
              value: problem.PROBLEM_ANSWER.answer,
            };
          }
          return {
            problemId: problem.id,
            optionId:
              problem.PROBLEM_OPTIONS.find((option) => option.isCorrect)?.id ||
              problem.PROBLEM_OPTIONS[0].id,
          };
        }),
      });

    expect(submissionResult.data).toBeDefined();
    const earnedXP = SEED_DATA.LESSONS[0].PROBLEMS.reduce(
      (acc, problem) => acc + problem.xp,
      0
    );

    PROFILE.totalXP += earnedXP;
    PROFILE.currentStreak = 1; // Reset streak to 1
    PROFILE.bestStreak = Math.max(PROFILE.bestStreak, PROFILE.currentStreak);
    expect(submissionResult.data).toEqual(
      expect.objectContaining({
        correctCount: SEED_DATA.LESSONS[0].PROBLEMS.length,
        earnedXP,
        newTotalXP: PROFILE.totalXP,
        streak: {
          current: PROFILE.currentStreak,
          best: PROFILE.bestStreak,
        },
        lessonProgress: 1,
      })
    );
  });

  it('should return the profile with updated values after lastActivityDate reset', async () => {
    // Check the profile after lastActivityDate reset
    const profileResult = await ty.api.profile.get();
    expect(profileResult.data).toBeDefined();
    expect(profileResult.data).toEqual(expect.objectContaining(PROFILE));
  });

  it('should return all lessons with all completed progress', async () => {
    // Fetch all lessons after all submissions
    const lessonsResult = await ty.api.lessons.get();
    expect(lessonsResult.data).toBeDefined();
    expect(lessonsResult.data).toEqual(
      expect.arrayContaining(
        SEED_DATA.LESSONS.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          id: lesson.id,
          progress: 1, // All lessons should be completed
        }))
      )
    );
  });

  it('should not double count problems when submitting answers with the same problemId', async () => {
    // Submit answers with the same problemId
    const newAttemptId = crypto.randomUUID();
    const problem = SEED_DATA.LESSONS[0].PROBLEMS[0];
    let answer:
      | { problemId: string; optionId: string }
      | { problemId: string; value: number } = {
      problemId: problem.id,
      value: 0,
    };

    if (problem.PROBLEM_ANSWER) {
      answer = {
        problemId: problem.id,
        value: problem.PROBLEM_ANSWER.answer,
      };
    } else {
      answer = {
        problemId: problem.id,
        optionId:
          problem.PROBLEM_OPTIONS.find((option) => option.isCorrect)?.id ||
          problem.PROBLEM_OPTIONS[0].id,
      };
    }

    const submissionResult = await ty.api
      .lessons({
        lessonId: SEED_DATA.LESSONS[0].id,
      })
      .submit.post({
        attemptId: newAttemptId,
        answers: [
          answer,
          answer, // Submit the same answer again
          answer,
        ],
      });
    expect(submissionResult.data).toBeDefined();
    PROFILE.totalXP += problem.xp; // Only count once
    expect(submissionResult.data).toEqual(
      expect.objectContaining({
        correctCount: 1, // Should only count once
        earnedXP: problem.xp,
        newTotalXP: PROFILE.totalXP,
        streak: {
          current: PROFILE.currentStreak,
          best: PROFILE.bestStreak,
        },
        lessonProgress: 1 / SEED_DATA.LESSONS[0].PROBLEMS.length,
      })
    );
  });

  it('should return invalid problemId error when submitting with an invalid problemId', async () => {
    // Submit with an invalid problemId
    const invalidProblemId = 'invalid-problem-id';
    const submissionResult = await ty.api
      .lessons({
        lessonId: SEED_DATA.LESSONS[0].id,
      })
      .submit.post({
        attemptId: crypto.randomUUID(),
        answers: [
          {
            problemId: invalidProblemId,
            value: 12,
          },
        ],
      });

    expect(submissionResult.error).toBeDefined();
    expect(submissionResult.error?.status).toBe(422);
  });

  it('should return invalid problem answer error when submitting an INPUT problem without value field', async () => {
    // Submit an INPUT problem without value field
    const problemId =
      SEED_DATA.LESSONS[0].PROBLEMS.find((problem) => problem.type === 'INPUT')
        ?.id || '';
    const submissionResult = await ty.api
      .lessons({
        lessonId: SEED_DATA.LESSONS[0].id,
      })
      .submit.post({
        attemptId: crypto.randomUUID(),
        answers: [
          {
            problemId,
            optionId: 'anything',
          },
        ],
      });

    expect(submissionResult.error).toBeDefined();
    expect(submissionResult.error?.status).toBe(422);
  });

  it('should return invalid problem answer error when submitting a MULTIPLE_CHOICE problem without optionId field', async () => {
    // Submit an INPUT problem without value field
    const problemId =
      SEED_DATA.LESSONS[0].PROBLEMS.find(
        (problem) => problem.type === 'MULTIPLE_CHOICE'
      )?.id || '';
    const submissionResult = await ty.api
      .lessons({
        lessonId: SEED_DATA.LESSONS[0].id,
      })
      .submit.post({
        attemptId: crypto.randomUUID(),
        answers: [
          {
            problemId,
            value: 1,
          },
        ],
      });

    expect(submissionResult.error).toBeDefined();
    expect(submissionResult.error?.status).toBe(422);
  });

  it('should return not found error when retrieving a lesson that does not exist', async () => {
    // Try to get a lesson that does not exist
    const lessonId = 'non-existent-lesson';
    const lessonResult = await ty.api
      .lessons({
        lessonId,
      })
      .get();

    expect(lessonResult.error).toBeDefined();
    expect(lessonResult.error?.status).toBe(404);
  });

  it('should return a lesson with its problems and options', async () => {
    // Get a lesson with its problems and options
    const lessonId = SEED_DATA.LESSONS[0].id;
    const lessonResult = await ty.api
      .lessons({
        lessonId,
      })
      .get();

    expect(lessonResult.data).toBeDefined();
    expect(lessonResult.data).toEqual(
      expect.objectContaining({
        id: lessonId,
        title: SEED_DATA.LESSONS[0].title,
        description: SEED_DATA.LESSONS[0].description,
        problems: expect.arrayContaining(
          SEED_DATA.LESSONS[0].PROBLEMS.map((problem) => ({
            id: problem.id,
            question: problem.question,
            type: problem.type,
            options:
              problem.PROBLEM_OPTIONS?.map((option) => ({
                id: option.id,
                option: String(option.option),
              })) || [],
          }))
        ),
      })
    );
  });
});
