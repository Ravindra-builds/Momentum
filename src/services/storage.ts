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

  /**
   * Export all app data as a JSON string.
   * Reads directly from localStorage using the same keys.
   */
  exportBackup(): string {
    const data: Record<string, unknown> = {};
    Object.entries(KEYS).forEach(([, localStorageKey]) => {
      const raw = localStorage.getItem(localStorageKey);
      if (raw) {
        try {
          data[localStorageKey] = JSON.parse(raw);
        } catch {
          data[localStorageKey] = null;
        }
      }
    });

    const backup = {
      __momentum_backup: true,
      version: 1,
      exportedAt: new Date().toISOString(),
      data,
    };

    return JSON.stringify(backup, null, 2);
  },

  /**
   * Validate and import backup data.
   * Returns { ok: true } on success, { ok: false, error: string } on failure.
   * Does NOT write anything until validation passes.
   */
  importBackup(jsonString: string): { ok: true } | { ok: false; error: string } {
    // 1. Parse
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      return { ok: false, error: 'Invalid JSON file. Please check the file.' };
    }

    // 2. Check it's our backup format
    if (!parsed || typeof parsed !== 'object') {
      return { ok: false, error: 'Not a valid Momentum backup file.' };
    }

    const obj = parsed as Record<string, unknown>;

    if (!obj.__momentum_backup) {
      return { ok: false, error: 'Not a Momentum backup file.' };
    }

    if (typeof obj.version !== 'number' || obj.version < 1) {
      return { ok: false, error: 'Unsupported backup version.' };
    }

    if (!obj.data || typeof obj.data !== 'object') {
      return { ok: false, error: 'Backup file has no data section.' };
    }

    const backupData = obj.data as Record<string, unknown>;

    // 3. Validate each known key's structure
    const knownKeys = Object.values(KEYS) as string[];

    for (const key of knownKeys) {
      if (!(key in backupData)) continue; // missing keys are fine (optional)
      const val = backupData[key];

      // study_logs must be array
      if (key === KEYS.STUDY_LOGS && val !== null && !Array.isArray(val)) {
        return { ok: false, error: 'Invalid study logs data in backup.' };
      }
      // habits must be array
      if (key === KEYS.HABITS && val !== null && !Array.isArray(val)) {
        return { ok: false, error: 'Invalid habits data in backup.' };
      }
      // todos must be array
      if (key === KEYS.TODOS && val !== null && !Array.isArray(val)) {
        return { ok: false, error: 'Invalid todos data in backup.' };
      }
      // settings must be object
      if (key === KEYS.SETTINGS && val !== null && (typeof val !== 'object' || Array.isArray(val))) {
        return { ok: false, error: 'Invalid settings data in backup.' };
      }
      // todo_day_log must be object
      if (key === KEYS.TODO_DAY_LOG && val !== null && (typeof val !== 'object' || Array.isArray(val))) {
        return { ok: false, error: 'Invalid todo day log data in backup.' };
      }
    }

    // 4. All valid — write to localStorage using the SAME keys
    try {
      for (const key of knownKeys) {
        if (key in backupData) {
          const val = backupData[key];
          if (val === null || val === undefined) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, JSON.stringify(val));
          }
        }
      }
    } catch (e) {
      return { ok: false, error: 'Failed to write backup data to storage.' };
    }

    return { ok: true };
  },
};
