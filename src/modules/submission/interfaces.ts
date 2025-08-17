interface Submission {
  id: string;
  userId: bigint;
  totalXP: number;
  earnedXP: number;
  lessonId: string;
  totalProblems: number;
  correctCount: number;
  bestStreak: number;
  currentStreak: number;
}

interface ICreateSubmissionParams extends Submission {}
