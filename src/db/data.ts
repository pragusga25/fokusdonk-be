export const SEED_DATA = {
  USER: {
    id: BigInt(1),
    name: 'Fokusdonk',
    email: 'demo@fokusdonk.com',
  },
  LESSONS: [
    {
      id: 'lesson1',
      title: 'Basic Arithmetic',
      description:
        'Learn basic arithmetic operations (addition and substraction)',
      order: 1,
      PROBLEMS: [
        {
          id: 'lesson1p1',
          question: 'What is 2 + 2?',
          type: 'INPUT',
          order: 1,
          xp: 30,
          PROBLEM_ANSWER: {
            id: 'lesson1p1a1',
            answer: 4,
          },
        },
        {
          id: 'lesson1p2',
          question: 'What is 5 - 3?',
          type: 'MULTIPLE_CHOICE',
          order: 2,
          xp: 35,
          PROBLEM_OPTIONS: [
            {
              id: 'lesson1p2o1',
              option: 2,
              order: 1,
              isCorrect: true,
            },
            {
              id: 'lesson1p2o2',
              option: 3,
              order: 2,
              isCorrect: false,
            },
            {
              id: 'lesson1p2o3',
              option: 4,
              order: 3,
              isCorrect: false,
            },
            {
              id: 'lesson1p2o4',
              option: 1,
              order: 4,
              isCorrect: false,
            },
          ],
        },
        {
          id: 'lesson1p3',
          question: 'What is 10 + 15?',
          type: 'MULTIPLE_CHOICE',
          order: 3,
          xp: 40,
          PROBLEM_OPTIONS: [
            {
              id: 'lesson1p3o1',
              option: 15,
              order: 1,
              isCorrect: false,
            },
            {
              id: 'lesson1p3o2',
              option: 20,
              order: 2,
              isCorrect: false,
            },
            {
              id: 'lesson1p3o3',
              option: 25,
              order: 3,
              isCorrect: true,
            },
            {
              id: 'lesson1p3o4',
              option: 35,
              order: 4,
              isCorrect: false,
            },
          ],
        },
        {
          id: 'lesson1p4',
          question: 'What is 1 + 21 - 5?',
          type: 'INPUT',
          order: 4,
          xp: 50,
          PROBLEM_ANSWER: {
            id: 'lesson1p4a1',
            answer: 17,
          },
        },
      ],
    },
    {
      id: 'lesson2',
      title: 'Multiplication Mastery',
      description: 'Master multiplication with fun exercises',
      order: 2,
      PROBLEMS: [
        {
          id: 'lesson2p1',
          question: 'What is 3 x 4?',
          type: 'INPUT',
          order: 1,
          xp: 30,
          PROBLEM_ANSWER: {
            id: 'lesson2p1a1',
            answer: 12,
          },
        },
        {
          id: 'lesson2p2',
          question: 'What is 6 x 7?',
          type: 'MULTIPLE_CHOICE',
          order: 2,
          xp: 35,
          PROBLEM_OPTIONS: [
            {
              id: 'lesson2p2o1',
              option: 42,
              order: 1,
              isCorrect: true,
            },
            {
              id: 'lesson2p2o2',
              option: 36,
              order: 2,
              isCorrect: false,
            },
            {
              id: 'lesson2p2o3',
              option: 48,
              order: 3,
              isCorrect: false,
            },
            {
              id: 'lesson2p2o4',
              option: 54,
              order: 4,
              isCorrect: false,
            },
          ],
        },
        {
          id: 'lesson2p3',
          question: 'What is 8 x 9?',
          type: 'MULTIPLE_CHOICE',
          order: 3,
          xp: 40,
          PROBLEM_OPTIONS: [
            {
              id: 'lesson2p3o1',
              option: 72,
              order: 4,
              isCorrect: true,
            },
            {
              id: 'lesson2p3o2',
              option: 64,
              order: 2,
              isCorrect: false,
            },
            {
              id: 'lesson2p3o3',
              option: 81,
              order: 3,
              isCorrect: false,
            },
            {
              id: 'lesson2p3o4',
              option: 90,
              order: 1,
              isCorrect: false,
            },
          ],
        },
        {
          id: 'lesson2p4',
          question: 'What is 5 x 6?',
          type: 'INPUT',
          order: 4,
          xp: 50,
          PROBLEM_ANSWER: {
            id: 'lesson2p4a1',
            answer: 30,
          },
        },
      ],
    },
    {
      id: 'lesson3',
      title: 'Division Basics',
      description: 'Understand division through practical examples',
      order: 3,
      PROBLEMS: [
        {
          id: 'lesson3p1',
          question: 'What is 20 ÷ 4?',
          type: 'INPUT',
          order: 1,
          xp: 30,
          PROBLEM_ANSWER: {
            id: 'lesson3p1a1',
            answer: 5,
          },
        },
        {
          id: 'lesson3p2',
          question: 'What is 15 ÷ 3?',
          type: 'MULTIPLE_CHOICE',
          order: 2,
          xp: 35,
          PROBLEM_OPTIONS: [
            {
              id: 'lesson3p2o1',
              option: 5,
              order: 1,
              isCorrect: true,
            },
            {
              id: 'lesson3p2o2',
              option: 6,
              order: 2,
              isCorrect: false,
            },
            {
              id: 'lesson3p2o3',
              option: 4,
              order: 3,
              isCorrect: false,
            },
            {
              id: 'lesson3p2o4',
              option: 7,
              order: 4,
              isCorrect: false,
            },
          ],
        },
        {
          id: 'lesson3p3',
          question: 'What is 36 ÷ 6?',
          type: 'MULTIPLE_CHOICE',
          order: 3,
          xp: 40,
          PROBLEM_OPTIONS: [
            {
              id: 'lesson3p3o1',
              option: 6,
              order: 1,
              isCorrect: true,
            },
            {
              id: 'lesson3p3o2',
              option: 5,
              order: 2,
              isCorrect: false,
            },
            {
              id: 'lesson3p3o3',
              option: 7,
              order: 3,
              isCorrect: false,
            },
            {
              id: 'lesson3p3o4',
              option: 8,
              order: 4,
              isCorrect: false,
            },
          ],
        },
        {
          id: 'lesson3p4',
          question:
            'What is the result of dividing the sum of (10 + 10) by (5)?',
          type: 'INPUT',
          order: 4,
          xp: 50,
          PROBLEM_ANSWER: {
            id: 'lesson3p4a1',
            answer: 4,
          },
        },
      ],
    },
  ],
};
