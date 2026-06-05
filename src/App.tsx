import { useEffect, useRef, useState, useCallback } from 'react';
import { AppProvider, useApp } from './hooks/useAppData';
import BottomNav from './components/BottomNav';
import Dashboard from './screens/Dashboard';
import Habits from './screens/Habits';
import Todos from './screens/Todos';
import Heatmaps from './screens/Heatmaps';
import Stats from './screens/Stats';
import Settings from './screens/Settings';
import type { Screen, TabScreen } from './types';

// Ordered tab screens for swipe direction calculation
const TAB_ORDER: TabScreen[] = ['dashboard', 'habits', 'todos', 'heatmaps', 'stats'];

const SCREEN_MAP: Record<Screen, React.FC> = {
  dashboard: Dashboard,
  habits: Habits,
  todos: Todos,
  heatmaps: Heatmaps,
  stats: Stats,
  settings: Settings,
};

type SlideDir = 'left' | 'right' | 'fade';

function AppContent() {
  const { screen, setScreen } = useApp();
  const [slideDir, setSlideDir] = useState<SlideDir>('fade');

  // ── Touch swipe handling ──
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);
  const mainRef = useRef<HTMLElement>(null);

  // Navigate with slide direction
  const navigateTo = useCallback((next: Screen) => {
    const curIdx = TAB_ORDER.indexOf(screen as TabScreen);
    const nxtIdx = TAB_ORDER.indexOf(next as TabScreen);

    // Settings isn't in tabs — just fade
    if (curIdx === -1 || nxtIdx === -1) {
      setSlideDir('fade');
    } else if (nxtIdx > curIdx) {
      setSlideDir('left');
    } else if (nxtIdx < curIdx) {
      setSlideDir('right');
    } else {
      setSlideDir('fade');
    }
    setScreen(next);
  }, [screen, setScreen]);

  // Expose navigateTo so BottomNav can pass direction
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__navigateTo = navigateTo;
  }, [navigateTo]);

  // Dismiss splash on first mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const fn = (window as unknown as Record<string, (() => void) | undefined>).__hideSplash;
      if (fn) fn();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Touch handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // If horizontal movement dominates, mark as swiping
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      isSwiping.current = true;
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    if (screen === 'settings') return; // no swipe on settings

    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 60; // minimum swipe distance

    const curIdx = TAB_ORDER.indexOf(screen as TabScreen);

    if (dx < -threshold && curIdx < TAB_ORDER.length - 1) {
      // Swipe left → next tab
      setSlideDir('left');
      setScreen(TAB_ORDER[curIdx + 1]);
    } else if (dx > threshold && curIdx > 0) {
      // Swipe right → previous tab
      setSlideDir('right');
      setScreen(TAB_ORDER[curIdx - 1]);
    }
  }, [screen, setScreen]);

  const ScreenComponent = SCREEN_MAP[screen] || Dashboard;
  const slideClass =
    slideDir === 'left'  ? 'screen-slide-left'  :
    slideDir === 'right' ? 'screen-slide-right' :
    'screen-fade';

  return (
    <div className="flex flex-col h-[100dvh] bg-[#050505] max-w-lg mx-auto relative select-none">
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div key={screen} className={slideClass}>
          <ScreenComponent />
        </div>
      </main>
      {screen !== 'settings' && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
