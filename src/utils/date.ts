export function getToday(): string {
  return formatDate(new Date());
}

export function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatDate(d);
}

export function getYesterday(): string {
  return getDateOffset(getToday(), -1);
}

export function getDateOffset(dateStr: string, offset: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + offset);
  return formatDate(d);
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getDaysBetween(a: string, b: string): number {
  const da = parseDate(a);
  const db = parseDate(b);
  return Math.round((db.getTime() - da.getTime()) / (86400000));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export function getWeekDates(weeks: number = 26): string[] {
  const dates: string[] = [];
  const today = new Date();
  const totalDays = weeks * 7;
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
}

export function formatDisplayDate(dateStr: string): string {
  const d = parseDate(dateStr);
  const today = new Date();
  const todayStr = formatDate(today);
  const tomorrowStr = getDateOffset(todayStr, 1);
  const yesterdayStr = getDateOffset(todayStr, -1);

  if (dateStr === todayStr) return 'Today';
  if (dateStr === tomorrowStr) return 'Tomorrow';
  if (dateStr === yesterdayStr) return 'Yesterday';

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export function formatFullDate(dateStr: string): string {
  const d = parseDate(dateStr);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getMonthLabel(dateStr: string): string {
  const d = parseDate(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[d.getMonth()];
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

export function getDayOfWeekIndex(dateStr: string): number {
  return parseDate(dateStr).getDay();
}

export function calculateStreak(activeDates: string[]): { current: number; longest: number } {
  if (activeDates.length === 0) return { current: 0, longest: 0 };

  const uniqueDates = [...new Set(activeDates)].sort();
  const today = getToday();
  const yesterday = getYesterday();

  // Calculate longest streak
  let longest = 1;
  let tempStreak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = getDaysBetween(uniqueDates[i - 1], uniqueDates[i]);
    if (diff === 1) {
      tempStreak++;
      longest = Math.max(longest, tempStreak);
    } else if (diff > 1) {
      tempStreak = 1;
    }
  }

  // Calculate current streak (must include today or yesterday)
  let current = 0;
  if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
    const startDate = uniqueDates.includes(today) ? today : yesterday;
    let checkDate = startDate;
    const dateSet = new Set(uniqueDates);
    while (dateSet.has(checkDate)) {
      current++;
      checkDate = getDateOffset(checkDate, -1);
    }
  }

  return { current, longest: Math.max(longest, current) };
}

export function getLast30Days(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
}

export function getLast7Days(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
}
