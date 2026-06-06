import { useState, useRef, useEffect } from 'react';
import { Settings, Flame, Trophy, Sparkles, Clock, RotateCcw } from 'lucide-react';
import { useApp } from '../hooks/useAppData';
import { getToday, getGreeting, formatFullDate, getLast30Days } from '../utils/date';

const QUICK_HOURS = [0.5, 1, 2, 3, 4, 5, 6];

const QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "Small daily improvements lead to stunning results.",
  "Consistency beats intensity. Show up every day.",
  "One more green day. That's all it takes.",
  "The secret of getting ahead is getting started.",
  "You don't have to be extreme, just consistent.",
  "Every expert was once a beginner.",
  "Progress, not perfection.",
];

export default function Dashboard() {
  const {
    settings, studyLogs, getStudyHoursForDate, getStudyStreak, addStudyHours, removeStudyLog,
    getStudyActivityMap, setScreen, addToast, toasts, dismissToast,
  } = useApp();

  const today = getToday();
  const todayHours = getStudyHoursForDate(today);
  const { current: currentStreak, longest: longestStreak } = getStudyStreak();
  const activityMap = getStudyActivityMap();
  const last30 = getLast30Days();

  const [animatingHours, setAnimatingHours] = useState(false);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const miniHeatmapRef = useRef<HTMLDivElement>(null);

  // Auto-scroll mini heatmap to show today (rightmost)
  useEffect(() => {
    if (miniHeatmapRef.current) {
      miniHeatmapRef.current.scrollLeft = miniHeatmapRef.current.scrollWidth;
    }
  }, []);

  const todayLogIds = studyLogs.filter(l => l.date === today).map(l => l.id);

  const handleQuickLog = (hours: number) => {
    const id = addStudyHours(hours);
    setAnimatingHours(true);
    setTimeout(() => setAnimatingHours(false), 400);
    setShowResetConfirm(false);

    const undoFn = () => {
      removeStudyLog(id);
      addToast('Undone');
    };

    addToast(`+${hours}h logged`, { label: 'Undo', fn: undoFn });
  };

  const handleReset = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 4000);
      return;
    }
    todayLogIds.forEach(id => removeStudyLog(id));
    setShowResetConfirm(false);
    setAnimatingHours(true);
    setTimeout(() => setAnimatingHours(false), 400);
    addToast('Study hours reset');
  };

  const activeToast = toasts.length > 0 ? toasts[toasts.length - 1] : null;

  return (
    <div className="px-4 pt-4 pb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center">
              <Sparkles size={14} className="text-green-500" />
            </div>
            Momentum
          </h1>
        </div>
        <button
          onClick={() => {
            const nav = (window as unknown as Record<string, ((s: string) => void) | undefined>).__navigateTo;
            if (nav) nav('settings'); else setScreen('settings');
          }}
          className="btn-press p-2.5 rounded-xl text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50 transition-all"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Greeting */}
      <div className="mb-6">
        <p className="text-neutral-300 text-base font-medium">
          {getGreeting()}{settings.userName ? `, ${settings.userName}` : ''} 👋
        </p>
        <p className="text-neutral-500 text-xs mt-0.5">{formatFullDate(today)}</p>
      </div>

      {/* Main Study Card */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 mb-5 card-hover relative overflow-hidden">
        {/* Subtle gradient glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Streak row */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <Flame size={16} className={currentStreak > 0 ? 'text-orange-500 animate-streak-pulse' : 'text-neutral-700'} />
              <span className="text-sm font-semibold text-neutral-200">{currentStreak}</span>
              <span className="text-xs text-neutral-600">day streak</span>
            </div>
            <div className="w-px h-3 bg-neutral-800" />
            <div className="flex items-center gap-1.5">
              <Trophy size={14} className="text-yellow-600" />
              <span className="text-sm font-semibold text-neutral-200">{longestStreak}</span>
              <span className="text-xs text-neutral-600">best</span>
            </div>
          </div>

          {/* Hours display + Reset */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-end gap-2 mb-1">
                <span
                  className={`text-5xl font-extrabold text-neutral-50 tracking-tight smooth-number ${
                    animatingHours ? 'animate-number-pop' : ''
                  }`}
                >
                  {todayHours}
                </span>
                <span className="text-lg text-neutral-500 font-medium pb-1.5">hours</span>
              </div>
              <p className="text-xs text-neutral-600">studied today</p>
            </div>

            {/* Reset Button */}
            {todayHours > 0 && (
              <button
                onClick={handleReset}
                className={`btn-press flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  showResetConfirm
                    ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                    : 'bg-neutral-800/50 text-neutral-500 border border-transparent hover:text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <RotateCcw size={12} />
                {showResetConfirm ? 'Confirm?' : 'Reset'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Log Buttons */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock size={12} />
          Quick Log
        </h2>
        <div className="grid grid-cols-4 gap-2 stagger-children">
          {QUICK_HOURS.map(h => (
            <button
              key={h}
              onClick={() => handleQuickLog(h)}
              className="btn-press bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl py-3 text-center hover:border-green-500/20 hover:bg-green-500/5 transition-all group"
            >
              <span className="text-sm font-bold text-neutral-300 group-hover:text-green-400 transition-colors">
                +{h}h
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mini Heatmap - Last 30 days */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
          Last 30 Days
        </h2>
        <div ref={miniHeatmapRef} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-3 overflow-x-auto heatmap-scroll">
          <div className="flex gap-[3px]">
            {last30.map(date => {
              const hours = activityMap[date] || 0;
              const intensity = hours === 0 ? 0 : hours <= 1 ? 1 : hours <= 3 ? 2 : hours <= 5 ? 3 : 4;
              const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
              const isToday = date === today;
              return (
                <div
                  key={date}
                  className="rounded-[3px] flex-shrink-0 transition-all duration-200"
                  style={{
                    width: 8,
                    height: isToday ? 32 : 28,
                    backgroundColor: colors[intensity],
                    marginTop: isToday ? -2 : 0,
                    borderRadius: isToday ? 3 : 2,
                  }}
                  title={`${date}: ${hours}h`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-br from-green-500/[0.08] to-transparent border border-green-500/10 rounded-xl p-4 mb-4">
        <p className="text-xs text-neutral-400 italic leading-relaxed">
          "{quote}"
        </p>
      </div>

      {/* Toast */}
      {activeToast && (
        <div
          key={activeToast.id}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 animate-toast-in"
        >
          <div className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 shadow-2xl">
            <span className="text-sm text-neutral-200 font-medium">{activeToast.message}</span>
            {activeToast.action && (
              <button
                onClick={() => {
                  activeToast.action!.fn();
                  dismissToast(activeToast.id);
                }}
                className="text-sm font-semibold text-green-400 hover:text-green-300 transition-colors"
              >
                {activeToast.action.label}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
