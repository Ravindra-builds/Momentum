export interface StudyLog {
  id: string;
  date: string; // YYYY-MM-DD
  hours: number;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  type: 'good' | 'bad';
  isPrivate: boolean;
  alias: string;
  completions: Record<string, boolean>; // date string -> completed
  createdAt: string;
}

export interface Todo {
  id: string;
  title: string;
  targetDate: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface AppSettings {
  reminderEnabled: boolean;
  reminderTime: string; // HH:MM
  userName: string;
}

export interface StreakInfo {
  current: number;
  longest: number;
}

export interface DayActivity {
  date: string;
  value: number;
}

export type Screen = 'dashboard' | 'habits' | 'todos' | 'heatmaps' | 'stats' | 'settings' | 'guide';

/**
 * Persistent record: date → count of completed todos.
 * Survives todo deletion — once completed, it's recorded forever.
 * count > 0 = green dot on heatmap.
 */
export type TodoDayLog = Record<string, number>; // date string -> completed count

export type TabScreen = 'dashboard' | 'habits' | 'todos' | 'heatmaps' | 'stats';
