export interface LessonWithProgress {
  id: string;
  title: string;
  description: string | null;
  progress: number;
}

export interface LessonWithProblemsAndOptions {
  id: string;
  title: string;
  description: string | null;
  problems: {
    id: string;
    question: string;
    type: 'MULTIPLE_CHOICE' | 'INPUT';
    options: {
      id: string;
      option: string;
    }[];
  }[];
}

export interface LessonWithProblemsAndCorrectAnswers {
  id: string;
  title: string;
  description: string | null;
  problems: {
    id: string;
    type: 'MULTIPLE_CHOICE' | 'INPUT';
    xp: number;
    correctOptionId: string | null; // for MULTIPLE_CHOICE
    correctAnswer: number | null; // for INPUT
  }[];
}

export interface LessonCounts {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  answeredProblems: number;
  totalProblems: number;
}

export interface IListLessonsParams {
  userId: bigint;
}
