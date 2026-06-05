import { Home, CheckCircle, ListTodo, Grid3x3, BarChart3 } from 'lucide-react';
import type { TabScreen } from '../types';
import { useApp } from '../hooks/useAppData';

const tabs: { id: TabScreen; icon: React.ElementType; label: string }[] = [
  { id: 'dashboard', icon: Home, label: 'Home' },
  { id: 'habits', icon: CheckCircle, label: 'Habits' },
  { id: 'todos', icon: ListTodo, label: 'Todos' },
  { id: 'heatmaps', icon: Grid3x3, label: 'Map' },
  { id: 'stats', icon: BarChart3, label: 'Stats' },
];

export default function BottomNav() {
  const { screen } = useApp();

  const handleTap = (id: TabScreen) => {
    // Use the directional navigate function from App.tsx
    const nav = (window as unknown as Record<string, ((s: TabScreen) => void) | undefined>).__navigateTo;
    if (nav) {
      nav(id);
    }
  };

  return (
    <nav
      className="flex items-center justify-around px-2 pt-2 pb-2 safe-bottom border-t border-[#1a1a1a] bg-[#050505]/95 backdrop-blur-xl"
      style={{ minHeight: 64 }}
    >
      {tabs.map(tab => {
        const active = screen === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => handleTap(tab.id)}
            className={`btn-press relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
              active
                ? 'text-green-500'
                : 'text-neutral-600 active:text-neutral-400'
            }`}
            style={active ? { background: 'rgba(34, 197, 94, 0.08)' } : {}}
          >
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
            {active && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full bg-green-500" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
