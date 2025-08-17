import { t } from 'elysia';

export const SubmitBodySchema = t.Object({
  attemptId: t.String(),
  answers: t.Array(
    t.Union([
      t.Object({
        problemId: t.String(),
        value: t.Number({
          description: 'User input for the INPUT problem type',
          example: 42,
        }),
      }),
      t.Object({
        problemId: t.String(),
        optionId: t.String({
          description:
            'Selected option ID for the MULTIPLE_CHOICE problem type',
          example: 'option123',
        }),
      }),
    ]),
    {
      description: 'List of answers submitted for the lesson',
      minItems: 1,
      error() {
        return 'At least one answer must be provided';
      },
    }
  ),
});

export const SubmitResponseSchema = t.Object({
  correctCount: t.Integer({
    minimum: 0,
    description: 'Number of correct answers submitted',
  }),
  totalProblems: t.Integer({
    minimum: 1,
    description: 'Total number of problems in the lesson',
  }),
  earnedXP: t.Integer({
    minimum: 0,
    description: 'XP earned from the submission',
  }),
  newTotalXP: t.Integer({
    minimum: 0,
    description: 'New total XP after the submission',
  }),
  streak: t.Object({
    current: t.Integer({
      minimum: 0,
      description: 'Current streak after submission',
    }),
    best: t.Integer({
      minimum: 0,
      description: 'Best streak after submission',
    }),
  }),
  lessonProgress: t.Number({
    minimum: 0,
    maximum: 1,
  }),
});

export const LessonDetailSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.Nullable(t.String()),
  problems: t.Array(
    t.Object({
      id: t.String(),
      type: t.Union([t.Literal('MULTIPLE_CHOICE'), t.Literal('INPUT')]),
      question: t.String(),
      options: t.Array(
        t.Object({
          id: t.String(),
          option: t.String(),
        }),
        {
          description: 'List of options for multiple choice problems',
        }
      ),
    })
  ),
});

export const LessonListSchema = t.Array(
  t.Object({
    id: t.String(),
    title: t.String(),
    description: t.Nullable(t.String()),
    progress: t.Number({
      minimum: 0,
      maximum: 1,
      description: 'Progress of the lesson as a percentage (0 to 1)',
    }),
  }),
  {
    description: 'List of lessons with progress',
  }
);

export type LessonList = typeof LessonListSchema.static;
export type SubmitResponse = typeof SubmitResponseSchema.static;
export type SubmitBody = typeof SubmitBodySchema.static;
export type LessonDetail = typeof LessonDetailSchema.static;
