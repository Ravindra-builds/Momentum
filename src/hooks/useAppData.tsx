import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { StudyLog, Habit, Todo, AppSettings, StreakInfo, Screen, TodoDayLog } from '../types';
import { storage } from '../services/storage';
import { getToday, getTomorrow, generateId, calculateStreak, getLast30Days } from '../utils/date';

interface Toast {
  id: string;
  message: string;
  action?: { label: string; fn: () => void };
}

interface AppContextType {
  // State
  studyLogs: StudyLog[];
  habits: Habit[];
  todos: Todo[];
  settings: AppSettings;
  screen: Screen;
  toasts: Toast[];

  // Navigation
  setScreen: (s: Screen) => void;

  // Study
  addStudyHours: (hours: number) => string;
  removeStudyLog: (id: string) => void;
  getStudyHoursForDate: (date: string) => number;
  getStudyStreak: () => StreakInfo;
  getStudyActivityMap: () => Record<string, number>;

  // Habits
  addHabit: (name: string, type: 'good' | 'bad', isPrivate: boolean, alias: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Pick<Habit, 'name' | 'type' | 'isPrivate' | 'alias'>>) => void;
  getHabitStreak: (id: string) => StreakInfo;
  getHabitActivityMap: (id: string) => Record<string, number>;
  getHabitSuccessRate: (id: string) => number;

  // Todos
  addTodo: (title: string, target: 'today' | 'tomorrow') => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  getTodosForDate: (date: string) => Todo[];
  getTodoCompletionRate: () => number;
  getTodoStreak: () => StreakInfo;
  getTodoActivityMap: () => Record<string, number>;

  // Settings
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Toasts
  addToast: (message: string, action?: { label: string; fn: () => void }) => void;
  dismissToast: (id: string) => void;

  // Stats
  getTotalStudyHours: () => number;
  getConsistencyPercentage: () => number;
  getCompletedDays: () => number;
  getTodayHabitsCompleted: () => number;
  getTodayHabitsTotal: () => number;
  getTodayTodosCompleted: () => number;
  getTodayTodosTotal: () => number;
  getLast30DaysActivity: () => { date: string; hours: number; habitsCompleted: number; todosCompleted: number }[];
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(() => storage.getStudyLogs());
  const [habits, setHabits] = useState<Habit[]>(() => storage.getHabits());
  const [todos, setTodos] = useState<Todo[]>(() => storage.getTodos());
  const [todoDayLog, setTodoDayLog] = useState<TodoDayLog>(() => storage.getTodoDayLog());
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist on change
  useEffect(() => { storage.saveStudyLogs(studyLogs); }, [studyLogs]);
  useEffect(() => { storage.saveHabits(habits); }, [habits]);
  useEffect(() => { storage.saveTodos(todos); }, [todos]);
  useEffect(() => { storage.saveTodoDayLog(todoDayLog); }, [todoDayLog]);
  useEffect(() => { storage.saveSettings(settings); }, [settings]);

  // ── Todo day log helpers ──
  // Persistent counter: date → how many todos were completed on that date
  // Increment on complete, decrement on uncomplete, NEVER touch on delete
  const logTodoComplete = useCallback((date: string) => {
    setTodoDayLog(prev => ({ ...prev, [date]: (prev[date] || 0) + 1 }));
  }, []);

  const logTodoUncomplete = useCallback((date: string) => {
    setTodoDayLog(prev => {
      const count = (prev[date] || 0) - 1;
      if (count <= 0) {
        const next = { ...prev };
        delete next[date];
        return next;
      }
      return { ...prev, [date]: count };
    });
  }, []);

  // === TOASTS ===
  const addToast = useCallback((message: string, action?: { label: string; fn: () => void }) => {
    const id = generateId();
    setToasts(prev => [...prev, { id, message, action }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // === STUDY ===
  const addStudyHours = useCallback((hours: number): string => {
    const id = generateId();
    setStudyLogs(prev => [...prev, {
      id,
      date: getToday(),
      hours,
      createdAt: new Date().toISOString(),
    }]);
    return id;
  }, []);

  const removeStudyLog = useCallback((id: string) => {
    setStudyLogs(prev => prev.filter(l => l.id !== id));
  }, []);

  const getStudyHoursForDate = useCallback((date: string): number => {
    return studyLogs
      .filter(l => l.date === date)
      .reduce((sum, l) => sum + l.hours, 0);
  }, [studyLogs]);

  const getStudyStreak = useCallback((): StreakInfo => {
    const activeDates = [...new Set(studyLogs.map(l => l.date))];
    return calculateStreak(activeDates);
  }, [studyLogs]);

  const getStudyActivityMap = useCallback((): Record<string, number> => {
    const map: Record<string, number> = {};
    studyLogs.forEach(l => {
      map[l.date] = (map[l.date] || 0) + l.hours;
    });
    return map;
  }, [studyLogs]);

  // === HABITS ===
  const addHabit = useCallback((name: string, type: 'good' | 'bad', isPrivate: boolean, alias: string) => {
    setHabits(prev => [...prev, {
      id: generateId(),
      name,
      type,
      isPrivate,
      alias,
      completions: {},
      createdAt: new Date().toISOString(),
    }]);
  }, []);

  const toggleHabitCompletion = useCallback((id: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const completions = { ...h.completions };
      if (completions[date]) {
        delete completions[date];
      } else {
        completions[date] = true;
      }
      return { ...h, completions };
    }));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const updateHabit = useCallback((id: string, updates: Partial<Pick<Habit, 'name' | 'type' | 'isPrivate' | 'alias'>>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  }, []);

  const getHabitStreak = useCallback((id: string): StreakInfo => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return { current: 0, longest: 0 };
    const activeDates = Object.keys(habit.completions).filter(d => habit.completions[d]);
    return calculateStreak(activeDates);
  }, [habits]);

  const getHabitActivityMap = useCallback((id: string): Record<string, number> => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return {};
    const map: Record<string, number> = {};
    Object.keys(habit.completions).forEach(d => {
      if (habit.completions[d]) map[d] = 1;
    });
    return map;
  }, [habits]);

  const getHabitSuccessRate = useCallback((id: string): number => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return 0;
    const created = habit.createdAt;
    const createdDate = created.split('T')[0];
    const today = getToday();
    const daysSince = Math.max(1, Math.round((new Date(today).getTime() - new Date(createdDate).getTime()) / 86400000) + 1);
    const completedDays = Object.values(habit.completions).filter(Boolean).length;
    return Math.round((completedDays / daysSince) * 100);
  }, [habits]);

  // === TODOS ===
  const addTodo = useCallback((title: string, target: 'today' | 'tomorrow') => {
    const targetDate = target === 'today' ? getToday() : getTomorrow();
    setTodos(prev => [...prev, {
      id: generateId(),
      title,
      targetDate,
      completed: false,
      createdAt: new Date().toISOString(),
    }]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    const existing = todos.find(t => t.id === id);
    if (!existing) return;
    // Can only toggle if targetDate is today or earlier
    if (existing.targetDate > getToday()) return;

    const wasCompleted = existing.completed;

    setTodos(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        completed: !t.completed,
        completedAt: !t.completed ? new Date().toISOString() : undefined,
      };
    }));

    // Update the persistent day log
    if (wasCompleted) {
      // Was done → now undone → decrement
      logTodoUncomplete(existing.targetDate);
    } else {
      // Was undone → now done → increment
      logTodoComplete(existing.targetDate);
    }
  }, [todos, logTodoComplete, logTodoUncomplete]);

  const deleteTodo = useCallback((id: string) => {
    // Just remove from live todos — do NOT touch the day log
    // (completions already recorded stay recorded forever)
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const getTodosForDate = useCallback((date: string): Todo[] => {
    return todos.filter(t => t.targetDate === date);
  }, [todos]);

  const getTodoCompletionRate = useCallback((): number => {
    const today = getToday();
    const relevantTodos = todos.filter(t => t.targetDate <= today);
    if (relevantTodos.length === 0) return 100;
    const completed = relevantTodos.filter(t => t.completed).length;
    return Math.round((completed / relevantTodos.length) * 100);
  }, [todos]);

  const getTodoStreak = useCallback((): StreakInfo => {
    // Any date with count > 0 in the persistent log counts as active
    const completedDates = Object.keys(todoDayLog).filter(d => (todoDayLog[d] || 0) > 0);
    return calculateStreak(completedDates);
  }, [todoDayLog]);

  const getTodoActivityMap = useCallback((): Record<string, number> => {
    const today = getToday();
    const map: Record<string, number> = {};

    // Persistent log: count of completed todos per date
    // count > 0 = green on heatmap, intensity scales with count
    Object.keys(todoDayLog).forEach(date => {
      if (date <= today) {
        map[date] = todoDayLog[date] || 0;
      }
    });

    return map;
  }, [todoDayLog]);

  // === SETTINGS ===
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // === STATS ===
  const getTotalStudyHours = useCallback((): number => {
    return Math.round(studyLogs.reduce((sum, l) => sum + l.hours, 0) * 10) / 10;
  }, [studyLogs]);

  const getConsistencyPercentage = useCallback((): number => {
    const activityMap = getStudyActivityMap();
    const today = getToday();
    if (studyLogs.length === 0) return 0;

    const earliestLog = studyLogs.reduce((min, l) => l.date < min ? l.date : min, today);
    const daysSince = Math.max(1, Math.round((new Date(today).getTime() - new Date(earliestLog).getTime()) / 86400000) + 1);
    const activeDays = Object.keys(activityMap).length;
    return Math.round((activeDays / daysSince) * 100);
  }, [studyLogs, getStudyActivityMap]);

  const getCompletedDays = useCallback((): number => {
    return new Set(studyLogs.map(l => l.date)).size;
  }, [studyLogs]);

  const getTodayHabitsCompleted = useCallback((): number => {
    const today = getToday();
    return habits.filter(h => h.completions[today]).length;
  }, [habits]);

  const getTodayHabitsTotal = useCallback((): number => {
    return habits.length;
  }, [habits]);

  const getTodayTodosCompleted = useCallback((): number => {
    const today = getToday();
    return todos.filter(t => t.targetDate === today && t.completed).length;
  }, [todos]);

  const getTodayTodosTotal = useCallback((): number => {
    const today = getToday();
    return todos.filter(t => t.targetDate === today).length;
  }, [todos]);

  const getLast30DaysActivity = useCallback(() => {
    const days = getLast30Days();
    const studyMap = getStudyActivityMap();

    return days.map(date => {
      const hours = studyMap[date] || 0;
      const habitsCompleted = habits.filter(h => h.completions[date]).length;
      const dayTodos = todos.filter(t => t.targetDate === date);
      const todosCompleted = dayTodos.filter(t => t.completed).length;

      return { date, hours, habitsCompleted, todosCompleted };
    });
  }, [getStudyActivityMap, habits, todos]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<AppContextType>(() => ({
    studyLogs, habits, todos, settings, screen, toasts,
    setScreen,
    addStudyHours, removeStudyLog, getStudyHoursForDate, getStudyStreak, getStudyActivityMap,
    addHabit, toggleHabitCompletion, deleteHabit, updateHabit, getHabitStreak, getHabitActivityMap, getHabitSuccessRate,
    addTodo, toggleTodo, deleteTodo, getTodosForDate, getTodoCompletionRate, getTodoStreak, getTodoActivityMap,
    updateSettings,
    addToast, dismissToast,
    getTotalStudyHours, getConsistencyPercentage, getCompletedDays,
    getTodayHabitsCompleted, getTodayHabitsTotal, getTodayTodosCompleted, getTodayTodosTotal,
    getLast30DaysActivity,
  }), [
    studyLogs, habits, todos, settings, screen, toasts,
    addStudyHours, removeStudyLog, getStudyHoursForDate, getStudyStreak, getStudyActivityMap,
    addHabit, toggleHabitCompletion, deleteHabit, updateHabit, getHabitStreak, getHabitActivityMap, getHabitSuccessRate,
    addTodo, toggleTodo, deleteTodo, getTodosForDate, getTodoCompletionRate, getTodoStreak, getTodoActivityMap,
    updateSettings,
    addToast, dismissToast,
    getTotalStudyHours, getConsistencyPercentage, getCompletedDays,
    getTodayHabitsCompleted, getTodayHabitsTotal, getTodayTodosCompleted, getTodayTodosTotal,
    getLast30DaysActivity,
    todoDayLog,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
