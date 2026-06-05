import type { StudyLog, Habit, Todo, AppSettings, TodoDayLog } from '../types';

const KEYS = {
  STUDY_LOGS: 'momentum_study_logs',
  HABITS: 'momentum_habits',
  TODOS: 'momentum_todos',
  SETTINGS: 'momentum_settings',
  TODO_DAY_LOG: 'momentum_todo_day_log',
};

const DEFAULT_SETTINGS: AppSettings = {
  reminderEnabled: false,
  reminderTime: '21:00',
  userName: '',
};

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write failed:', e);
  }
}

export const storage = {
  getStudyLogs(): StudyLog[] {
    return get<StudyLog[]>(KEYS.STUDY_LOGS, []);
  },
  saveStudyLogs(logs: StudyLog[]): void {
    set(KEYS.STUDY_LOGS, logs);
  },

  getHabits(): Habit[] {
    return get<Habit[]>(KEYS.HABITS, []);
  },
  saveHabits(habits: Habit[]): void {
    set(KEYS.HABITS, habits);
  },

  getTodos(): Todo[] {
    return get<Todo[]>(KEYS.TODOS, []);
  },
  saveTodos(todos: Todo[]): void {
    set(KEYS.TODOS, todos);
  },

  getSettings(): AppSettings {
    return get<AppSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(settings: AppSettings): void {
    set(KEYS.SETTINGS, settings);
  },

  getTodoDayLog(): TodoDayLog {
    return get<TodoDayLog>(KEYS.TODO_DAY_LOG, {});
  },
  saveTodoDayLog(log: TodoDayLog): void {
    set(KEYS.TODO_DAY_LOG, log);
  },

  clearAll(): void {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};
