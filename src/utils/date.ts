export const getUTCTodayDate = (): Date => {
  const today = new Date();
  return new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
};

export const changeTodayDateByDays = (days: number): Date => {
  const today = getUTCTodayDate();
  const newDate = new Date(today);
  newDate.setUTCDate(today.getUTCDate() + days);
  return newDate;
};

export const isToday = (date: Date): boolean => {
  const today = getUTCTodayDate();
  return (
    date.getUTCFullYear() === today.getUTCFullYear() &&
    date.getUTCMonth() === today.getUTCMonth() &&
    date.getUTCDate() === today.getUTCDate()
  );
};

export const isYesterday = (date: Date): boolean => {
  const today = getUTCTodayDate();
  const yesterday = new Date(today);
  yesterday.setUTCDate(today.getUTCDate() - 1);

  return (
    date.getUTCFullYear() === yesterday.getUTCFullYear() &&
    date.getUTCMonth() === yesterday.getUTCMonth() &&
    date.getUTCDate() === yesterday.getUTCDate()
  );
};
