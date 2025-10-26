/**
 * Converts days to a human-readable format with weeks
 */
export const formatDaysWithWeeks = (days: number): string => {
  if (days < 7) {
    return `${days.toFixed(1)} days`;
  }
  
  const weeks = days / 7;
  return `${days.toFixed(1)} days (${weeks.toFixed(1)} weeks)`;
};

/**
 * Gets the day of week for a given offset from today
 */
export const getDayOfWeek = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Checks if a day offset falls on a weekend
 */
export const isWeekend = (daysFromNow: number): boolean => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

/**
 * Gets a human-readable time context for days
 */
export const getTimeContext = (days: number): string => {
  if (days <= 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 3) return `In ${days} days`;
  if (days <= 7) return `End of this week`;
  if (days <= 14) return `Next week`;
  if (days <= 21) return `In 2-3 weeks`;
  if (days <= 30) return `This month`;
  return `In ${Math.ceil(days / 30)} months`;
};

/**
 * Gets the week number for a day offset
 */
export const getWeekNumber = (daysFromNow: number): number => {
  return Math.ceil((daysFromNow + 1) / 7);
};