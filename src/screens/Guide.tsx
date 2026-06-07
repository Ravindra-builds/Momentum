import { ArrowLeft } from 'lucide-react';
import { useApp } from '../hooks/useAppData';

// ── Visual UI Mock Components ──

function MockCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-3 ${className}`}>
      {children}
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center text-green-500 text-xs font-bold flex-shrink-0">
      {n}
    </div>
  );
}

function SectionDivider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent my-1" />;
}

function MiniHeatmap() {
  const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  const pattern = [0, 1, 2, 3, 4, 4, 3, 2, 1, 0, 2, 4, 3, 1, 0, 3, 4, 4, 2, 1];
  return (
    <div className="flex gap-[2px]">
      {pattern.map((c, i) => (
        <div key={i} className="rounded-[2px]" style={{ width: 10, height: 24, backgroundColor: colors[c] }} />
      ))}
    </div>
  );
}

function MockButton({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border ${
      active
        ? 'bg-green-500/15 border-green-500/30 text-green-400'
        : 'bg-[#0a0a0a] border-[#1a1a1a] text-neutral-500'
    }`}>
      {children}
    </div>
  );
}

// ── Guide Sections ──

const sections = [
  {
    emoji: '📊',
    title: 'Study Hour Logging',
    desc: 'Track your daily study hours with one tap. No timers, no distractions.',
    steps: [
      'Tap any quick-log button on the Dashboard',
      'Choose +0.5h, +1h, +2h, +3h, +4h, +5h, or +6h',
      'Hours add up throughout the day',
      'Made a mistake? Tap "Undo" in the toast, or use "Reset" to start over',
    ],
    mock: (
      <MockCard>
        <p className="text-[10px] text-neutral-600 mb-2">Today's Hours</p>
        <p className="text-2xl font-extrabold text-white mb-2">4.5 <span className="text-sm text-neutral-500 font-medium">hours</span></p>
        <div className="flex gap-1.5">
          <MockButton>+1h</MockButton>
          <MockButton>+2h</MockButton>
          <MockButton active>+3h</MockButton>
          <MockButton>+4h</MockButton>
        </div>
      </MockCard>
    ),
  },
  {
    emoji: '🔥',
    title: 'Streaks',
    desc: 'Build momentum with daily streaks. Consistency beats intensity.',
    steps: [
      'Log at least some study hours each day',
      'Your current streak increments automatically',
      'Miss a day? Streak resets to 0',
      'Your longest streak is saved as your personal best',
    ],
    mock: (
      <MockCard>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-lg font-extrabold text-orange-400">12</p>
            <p className="text-[9px] text-neutral-600">current</p>
          </div>
          <div className="w-px h-8 bg-neutral-800" />
          <div className="text-center">
            <p className="text-lg font-extrabold text-yellow-500">28</p>
            <p className="text-[9px] text-neutral-600">longest</p>
          </div>
        </div>
      </MockCard>
    ),
  },
  {
    emoji: '🗺️',
    title: 'Heatmaps',
    desc: 'GitHub-style consistency grids that visually motivate you to never miss a day.',
    steps: [
      'Open the "Map" tab to see your heatmaps',
      'Darker green = more hours logged that day',
      'Empty = missed day (not red, no guilt)',
      'Three maps: Study, Todos, and each Habit',
    ],
    mock: (
      <MockCard>
        <p className="text-[10px] text-neutral-500 mb-2 font-medium">Study Consistency</p>
        <MiniHeatmap />
        <div className="flex items-center gap-3 mt-2 text-[9px] text-neutral-600">
          <span>🔥 <span className="text-green-500 font-medium">5</span> day streak</span>
          <span>⭐ <span className="text-neutral-400 font-medium">21</span> best</span>
        </div>
      </MockCard>
    ),
  },
  {
    emoji: '📋',
    title: 'Todo System',
    desc: 'Plan tasks for today or tomorrow. Simple, fast, minimal.',
    steps: [
      'Tap "+ Add" to create a new todo',
      'Choose TODAY (active now) or TOMORROW (planned ahead)',
      'Today\'s todos are immediately completable',
      'Tomorrow\'s todos auto-activate the next day',
      'Only active-day todos count toward heatmaps',
    ],
    mock: (
      <MockCard>
        <div className="flex gap-1 mb-2">
          <div className="px-2 py-1 rounded-md text-[9px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">Today</div>
          <div className="px-2 py-1 rounded-md text-[9px] font-medium text-neutral-600 border border-transparent">Tomorrow</div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-green-500/30 bg-green-500/10 flex items-center justify-center">
              <span className="text-green-500 text-[8px]">✓</span>
            </div>
            <span className="text-[11px] text-neutral-500 line-through">Review notes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-neutral-700" />
            <span className="text-[11px] text-neutral-300">Practice problems</span>
          </div>
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-4 h-4 rounded border-2 border-neutral-800 flex items-center justify-center">
              <span className="text-neutral-700 text-[7px]">📅</span>
            </div>
            <span className="text-[11px] text-neutral-500">Read chapter 5</span>
            <span className="text-[8px] text-neutral-700 px-1 py-0.5 rounded bg-neutral-900">Tomorrow</span>
          </div>
        </div>
      </MockCard>
    ),
  },
  {
    emoji: '✅',
    title: 'Habit Tracking',
    desc: 'Track good habits and bad habits avoided. Tap once daily.',
    steps: [
      'Open the "Habits" tab',
      'Add good habits (Study, Workout, Reading...)',
      'Add bad habits to avoid (Reels, Junk Food...)',
      'Tap the circle once daily to mark complete',
      'Your streak per habit is tracked automatically',
    ],
    mock: (
      <MockCard>
        <p className="text-[10px] text-neutral-600 mb-2 font-medium uppercase tracking-wider">Good Habits</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <span className="text-green-500 text-[9px]">✓</span>
            </div>
            <span className="text-[11px] text-green-400">Study</span>
            <span className="text-[9px] text-orange-400 ml-auto">🔥5</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md border-2 border-neutral-700" />
            <span className="text-[11px] text-neutral-300">Workout</span>
          </div>
        </div>
        <p className="text-[10px] text-neutral-600 mt-3 mb-2 font-medium uppercase tracking-wider">Bad Habits Avoided</p>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <span className="text-green-500 text-[9px]">✓</span>
          </div>
          <span className="text-[11px] text-green-400">No Reels</span>
        </div>
      </MockCard>
    ),
  },
  {
    emoji: '🔒',
    title: 'Private Habits',
    desc: 'Some habits are personal. Mark them private to keep them discreet.',
    steps: [
      'When adding a habit, toggle "Private Habit" ON',
      'Set a custom display alias (e.g., "Focus", "Discipline")',
      'The real habit name gets blurred in the UI',
      'A lock icon appears next to private habits',
      'No shame-based wording — you choose what to display',
    ],
    mock: (
      <MockCard>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md border-2 border-neutral-700" />
            <span className="text-[11px] text-neutral-300">Reading</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <span className="text-green-500 text-[9px]">✓</span>
            </div>
            <span className="text-[10px] text-neutral-500">🔒</span>
            <span className="text-[11px] text-green-400">Focus</span>
            <span className="text-[8px] text-neutral-700 ml-1">(private)</span>
          </div>
        </div>
      </MockCard>
    ),
  },
  {
    emoji: '📈',
    title: 'Stats',
    desc: 'See your progress at a glance — total hours, streaks, consistency, and habit success rates.',
    steps: [
      'Open the "Stats" tab to see everything',
      'Total study hours across all time',
      'Current & longest streak',
      'Active days and consistency percentage',
      '7-day bar chart showing daily hours',
      'Per-habit success rates with progress bars',
    ],
    mock: (
      <MockCard>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[9px] text-neutral-600">Total Hours</p>
            <p className="text-base font-bold text-white">127.5</p>
          </div>
          <div>
            <p className="text-[9px] text-neutral-600">Active Days</p>
            <p className="text-base font-bold text-white">42</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-1 mt-2" style={{ height: 36 }}>
          {[2, 4, 3, 5, 6, 4, 3].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-green-500/40" style={{ height: `${h * 15}%` }} />
          ))}
        </div>
      </MockCard>
    ),
  },
  {
    emoji: '🔔',
    title: 'Daily Reminders',
    desc: 'Set a daily notification to remind you to log your day.',
    steps: [
      'Go to Settings → Reminders',
      'Toggle "Daily Reminder" ON',
      'Set your preferred time (e.g., 9:00 PM)',
      'Grant notification permission when asked',
      'You\'ll get one motivational reminder per day at that time',
      'Tap "Send Test" to verify it works',
    ],
    mock: (
      <MockCard>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-neutral-300 font-medium">Daily Reminder</span>
          <div className="w-8 h-[18px] rounded-full bg-green-600 relative">
            <div className="absolute top-[2px] right-[2px] w-[14px] h-[14px] rounded-full bg-white" />
          </div>
        </div>
        <div className="bg-[#050505] border border-[#222] rounded-lg px-2.5 py-1.5 text-[11px] text-neutral-400">
          21:00
        </div>
        <div className="mt-2 p-2 rounded-lg bg-neutral-900/50 border border-[#1a1a1a]">
          <p className="text-[10px] text-neutral-400 font-medium">🔔 Momentum</p>
          <p className="text-[10px] text-neutral-500">Protect your streak 🔥</p>
        </div>
      </MockCard>
    ),
  },
  {
    emoji: '💾',
    title: 'Backup & Restore',
    desc: 'Export your data to a file. Import it later to restore everything.',
    steps: [
      'Go to Settings → Backup & Restore',
      'Tap "Export Backup" — downloads a JSON file',
      'Save the file somewhere safe (Google Drive, etc.)',
      'To restore: tap "Import Backup" and select the file',
      'Data is validated before import — nothing gets corrupted',
    ],
    mock: (
      <MockCard>
        <p className="text-[10px] text-neutral-600 mb-2">Your data stays safe</p>
        <div className="flex gap-2">
          <div className="flex-1 py-1.5 rounded-lg text-center text-[10px] font-medium border border-[#222] text-neutral-500 flex items-center justify-center gap-1">
            <span>⬇</span> Export
          </div>
          <div className="flex-1 py-1.5 rounded-lg text-center text-[10px] font-medium border border-[#222] text-neutral-500 flex items-center justify-center gap-1">
            <span>⬆</span> Import
          </div>
        </div>
        <p className="text-[8px] text-neutral-700 mt-2 text-center">momentum-backup-2025-05-28.json</p>
      </MockCard>
    ),
  },
  {
    emoji: '📱',
    title: 'Install as App',
    desc: 'Add Momentum to your home screen for a native app experience.',
    steps: [
      'Open the app in Chrome on your phone',
      'Tap the ⋮ menu (three dots, top right)',
      'Tap "Install app" or "Add to Home Screen"',
      'The app icon appears on your home screen',
      'Opens fullscreen — no browser bar!',
      'Works offline after first visit',
    ],
    mock: null,
  },
];

export default function Guide() {
  const { setScreen } = useApp();

  return (
    <div className="px-4 pt-4 pb-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => {
            const nav = (window as unknown as Record<string, ((s: string) => void) | undefined>).__navigateTo;
            if (nav) nav('dashboard'); else setScreen('dashboard');
          }}
          className="btn-press p-2 rounded-xl text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50 transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">How It Works</h1>
          <p className="text-[11px] text-neutral-600 mt-0.5">Everything you need to know</p>
        </div>
      </div>

      {/* Welcome */}
      <div className="relative bg-gradient-to-br from-green-500/[0.08] to-transparent border border-green-500/10 rounded-2xl p-5 mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-lg">
              M
            </div>
            <h2 className="text-base font-bold text-neutral-100">Welcome to Momentum</h2>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            A minimal consistency tracker built around one idea: <span className="text-green-400 font-medium">show up every day.</span>
          </p>
          <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed">
            No timers. No overload. Just log your hours, track your habits, and watch your consistency grow — one green day at a time.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="stagger-children">
            {/* Section Header */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-lg">{section.emoji}</span>
              <h3 className="text-sm font-bold text-neutral-100">{section.title}</h3>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-500 mb-3 leading-relaxed">{section.desc}</p>

            {/* Visual Mock */}
            {section.mock && (
              <div className="mb-3">
                {section.mock}
              </div>
            )}

            {/* Steps */}
            <div className="space-y-2 mb-2">
              {section.steps.map((step, sIdx) => (
                <div key={sIdx} className="flex items-start gap-2.5">
                  <StepBadge n={sIdx + 1} />
                  <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>

            {idx < sections.length - 1 && <SectionDivider />}
          </div>
        ))}
      </div>

      {/* Closing */}
      <div className="mt-8 text-center">
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent mb-6" />
        <p className="text-sm font-semibold text-neutral-300 mb-1">That's it!</p>
        <p className="text-xs text-neutral-600 leading-relaxed mb-4">
          Start small. Stay consistent. Build momentum.
        </p>
        <button
          onClick={() => {
            const nav = (window as unknown as Record<string, ((s: string) => void) | undefined>).__navigateTo;
            if (nav) nav('dashboard'); else setScreen('dashboard');
          }}
          className="btn-press px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-colors"
        >
          Start Tracking →
        </button>
        <p className="text-[10px] text-neutral-700 mt-4">
          One more green day. That's all it takes. 🌱
        </p>
      </div>
    </div>
  );
}
