import db from '.';
import { USER_ID } from '../constants';
import { SEED_DATA } from './data';

export const seed = async () => {
  await db.user.upsert({
    where: { id: USER_ID },
    create: {
      id: USER_ID,
      email: SEED_DATA.USER.email,
      name: SEED_DATA.USER.name,
    },
    update: {
      // Reset user data
      lastActivityDate: null,
      totalXP: 0,
      currentStreak: 0,
      bestStreak: 0,
    },
  });

  for (const lesson of SEED_DATA.LESSONS) {
    await db.lesson.upsert({
      where: {
        id: lesson.id,
      },
      create: {
        order: lesson.order,
        title: lesson.title,
        description: lesson.description,
        id: lesson.id,
      },
      update: {},
    });

    for (const problem of lesson.PROBLEMS) {
      await db.problem.upsert({
        where: {
          id: problem.id,
        },
        create: {
          id: problem.id,
          question: problem.question,
          type: problem.type as 'INPUT' | 'MULTIPLE_CHOICE',
          order: problem.order,
          xp: problem.xp,
          lessonId: lesson.id,
        },
        update: {},
      });

      if (problem.PROBLEM_ANSWER) {
        await db.problemAnswer.upsert({
          where: {
            problemId: problem.id,
          },
          create: {
            answer: problem.PROBLEM_ANSWER.answer,
            problemId: problem.id,
          },
          update: {},
        });
      }

      if (problem.PROBLEM_OPTIONS) {
        for (const option of problem.PROBLEM_OPTIONS) {
          await db.problemOption.upsert({
            where: {
              id: option.id,
            },
            create: {
              id: option.id,
              option: String(option.option),
              order: option.order,
              isCorrect: option.isCorrect,
              problemId: problem.id,
            },
            update: {},
          });
        }
      }
    }
  }
};

if (import.meta.main) {
  seed()
    .then(() => {
      console.log('✅ Database seeded successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error seeding database:', error);
      process.exit(1);
    });
}
