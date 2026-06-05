import { useMemo } from 'react';
import { BookOpen, ListTodo, CheckCircle } from 'lucide-react';
import { useApp } from '../hooks/useAppData';
import Heatmap from '../components/Heatmap';

export default function Heatmaps() {
  const { getStudyActivityMap, getStudyStreak, habits, getHabitStreak, getHabitActivityMap, getTodoActivityMap, getTodoStreak, getCompletedDays } = useApp();

  const studyMap = getStudyActivityMap();
  const studyStreak = getStudyStreak();
  const studyActiveDays = getCompletedDays();

  const todoMap = getTodoActivityMap();
  const todoStreak = getTodoStreak();
  const todoActiveDays = useMemo(() => {
    return Object.values(todoMap).filter(v => v >= 1).length;
  }, [todoMap]);

  return (
    <div className="px-4 pt-4 pb-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-100 tracking-tight">Heatmaps</h1>
        <p className="text-xs text-neutral-600 mt-1">Your consistency over time</p>
      </div>

      {/* Study Heatmap */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 mb-4 card-hover">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center">
            <BookOpen size={13} className="text-green-500" />
          </div>
          <h2 className="text-sm font-semibold text-neutral-200">Study Consistency</h2>
        </div>
        <Heatmap
          data={studyMap}
          maxValue={8}
          currentStreak={studyStreak.current}
          longestStreak={studyStreak.longest}
          totalActiveDays={studyActiveDays}
        />
      </div>

      {/* Todo Heatmap */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 mb-4 card-hover">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <ListTodo size={13} className="text-blue-500" />
          </div>
          <h2 className="text-sm font-semibold text-neutral-200">Todo Consistency</h2>
        </div>
        <Heatmap
          data={todoMap}
          maxValue={1}
          currentStreak={todoStreak.current}
          longestStreak={todoStreak.longest}
          totalActiveDays={todoActiveDays}
        />
      </div>

      {/* Individual Habit Heatmaps */}
      {habits.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Habit Heatmaps
          </h2>
          <div className="space-y-4 stagger-children">
            {habits.map(habit => {
              const hMap = getHabitActivityMap(habit.id);
              const hStreak = getHabitStreak(habit.id);
              const hActive = Object.values(hMap).filter(v => v > 0).length;
              const displayName = habit.isPrivate && habit.alias ? habit.alias : habit.name;

              return (
                <div key={habit.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 card-hover">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      habit.type === 'good' ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      <CheckCircle size={13} className={habit.type === 'good' ? 'text-green-500' : 'text-red-400'} />
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-200">{displayName}</h3>
                    {habit.isPrivate && !habit.alias && (
                      <span className="text-[10px] text-neutral-600 px-1.5 py-0.5 rounded bg-neutral-900">Private</span>
                    )}
                  </div>
                  <Heatmap
                    data={hMap}
                    maxValue={1}
                    currentStreak={hStreak.current}
                    longestStreak={hStreak.longest}
                    totalActiveDays={hActive}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {habits.length === 0 && (
        <div className="text-center py-8 text-neutral-700 text-sm">
          Add habits to see their heatmaps here.
        </div>
      )}
    </div>
  );
}
