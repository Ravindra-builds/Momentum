import { Flame, Trophy, Clock, Calendar, TrendingUp } from 'lucide-react';
import { useApp } from '../hooks/useAppData';
import { getToday, getLast7Days } from '../utils/date';

export default function Stats() {
  const {
    getTotalStudyHours, getStudyStreak, getConsistencyPercentage, getCompletedDays,
    habits, getHabitStreak, getHabitSuccessRate, getStudyHoursForDate,
    getTodayHabitsCompleted, getTodayHabitsTotal, getTodayTodosCompleted, getTodayTodosTotal,
    getStudyActivityMap,
  } = useApp();

  const totalHours = getTotalStudyHours();
  const studyStreak = getStudyStreak();
  const consistency = getConsistencyPercentage();
  const completedDays = getCompletedDays();
  const today = getToday();
  const todayHours = getStudyHoursForDate(today);
  const activityMap = getStudyActivityMap();
  const habitsCompleted = getTodayHabitsCompleted();
  const habitsTotal = getTodayHabitsTotal();
  const todosCompleted = getTodayTodosCompleted();
  const todosTotal = getTodayTodosTotal();

  const last7 = getLast7Days();

  const statCard = (
    icon: React.ReactNode,
    label: string,
    value: string | number,
    sublabel?: string,
  ) => (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 card-hover">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-neutral-100">{value}</p>
      {sublabel && <p className="text-xs text-neutral-600 mt-0.5">{sublabel}</p>}
    </div>
  );

  return (
    <div className="px-4 pt-4 pb-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-100 tracking-tight flex items-center gap-2">
          <TrendingUp size={20} className="text-green-500" />
          Statistics
        </h1>
        <p className="text-xs text-neutral-500 mt-1">Your progress at a glance</p>
      </div>

      {/* Today's Summary */}
      <div className="bg-gradient-to-br from-green-500/[0.08] to-transparent border border-green-500/10 rounded-2xl p-5 mb-5">
        <h2 className="text-xs font-semibold text-green-500/80 uppercase tracking-wider mb-3">Today</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-100">{todayHours}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Hours</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-100">{habitsCompleted}/{habitsTotal}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Habits</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-100">{todosCompleted}/{todosTotal}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Todos</p>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5 stagger-children">
        {statCard(
          <Clock size={14} className="text-green-500" />,
          'Total Hours',
          totalHours,
          'all time study',
        )}
        {statCard(
          <Flame size={14} className="text-orange-500" />,
          'Current Streak',
          `${studyStreak.current}d`,
          studyStreak.current > 0 ? 'keep going! 🔥' : 'start today',
        )}
        {statCard(
          <Trophy size={14} className="text-yellow-500" />,
          'Longest Streak',
          `${studyStreak.longest}d`,
          'personal best',
        )}
        {statCard(
          <Calendar size={14} className="text-blue-400" />,
          'Active Days',
          completedDays,
          `${consistency}% consistency`,
        )}
      </div>

      {/* Last 7 Days Bar Chart */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 mb-5 card-hover">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">
          Last 7 Days
        </h2>
        <div className="flex items-end justify-between gap-2" style={{ height: 80 }}>
          {last7.map((date) => {
            const hours = activityMap[date] || 0;
            const maxH = 8;
            const height = Math.max(4, (hours / maxH) * 100);
            const isToday = date === today;
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[9px] font-medium text-neutral-600">
                  {hours > 0 ? `${hours}h` : ''}
                </span>
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    isToday ? 'bg-green-500' : hours > 0 ? 'bg-green-500/40' : 'bg-neutral-800/50'
                  }`}
                  style={{ height: `${height}%`, minHeight: 4 }}
                />
                <span className={`text-[9px] ${isToday ? 'text-green-500 font-semibold' : 'text-neutral-600'}`}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(date).getDay()]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit Stats */}
      {habits.length > 0 && (
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 card-hover">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Habit Success Rates
          </h2>
          <div className="space-y-3">
            {habits.map(habit => {
              const rate = getHabitSuccessRate(habit.id);
              const streak = getHabitStreak(habit.id);
              const displayName = habit.isPrivate && habit.alias ? habit.alias : habit.name;
              return (
                <div key={habit.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-neutral-300">{displayName}</span>
                      {streak.current > 0 && (
                        <span className="text-[10px] text-orange-400 font-medium">🔥{streak.current}</span>
                      )}
                    </div>
                    <span className="text-xs text-neutral-400 font-medium">{rate}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-green-500"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
