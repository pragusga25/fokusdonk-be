import { t } from 'elysia';

export const ProfileSchema = t.Object({
  currentStreak: t.Integer({
    description: 'Current streak of consecutive days with activity',
    example: 5,
    minimum: 0,
  }),
  bestStreak: t.Integer({
    description: 'Best streak of consecutive days with activity',
    example: 10,
    minimum: 0,
  }),
  totalXP: t.Integer(),
  progress: t.Number({
    description: 'Overall progress percentage',
    example: 0.75,
    minimum: 0,
    maximum: 1,
  }),
  lessonCompleted: t.Integer({
    description: 'Number of lessons completed by the user',
    minimum: 0,
  }),
  lessonInProgress: t.Integer({
    description: 'Number of lessons currently in progress',
    minimum: 0,
  }),
  lessonNotStarted: t.Integer({
    description: 'Number of lessons not started yet',
    minimum: 0,
  }),
  level: t.Integer({
    description: 'User level based on total XP',
    example: 1,
    minimum: 1,
  }),
});
