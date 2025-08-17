export interface Profile {
  currentStreak: number;
  bestStreak: number;
  totalXP: number;
  lastActivityDate: Date | null;
}

export interface IProfileResult extends Omit<Profile, 'lastActivityDate'> {
  lessonCompleted: number;
  lessonInProgress: number;
  lessonNotStarted: number;
  level: number;
  progress: number; // Overall progress percentage
}
