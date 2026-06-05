import { useState } from 'react';
import { ArrowLeft, Bell, User, Trash2, Shield, Heart, Info } from 'lucide-react';
import { useApp } from '../hooks/useAppData';

export default function Settings() {
  const { settings, updateSettings, setScreen } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleNotificationToggle = async () => {
    if (!settings.reminderEnabled) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          alert('Please allow notifications in your browser settings.');
          return;
        }
      } else {
        alert('Notifications are not supported in this browser.');
        return;
      }
    }
    updateSettings({ reminderEnabled: !settings.reminderEnabled });
  };

  const handleReset = () => {
    if (showResetConfirm) {
      localStorage.clear();
      window.location.reload();
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 4000);
    }
  };

  const sendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const messages = [
        "Protect your streak 🔥",
        "One more green day.",
        "Log today before sleeping.",
        "Consistency beats intensity.",
        "Show up every day. 💪",
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      new Notification('Momentum', {
        body: msg,
        icon: '⚡',
      });
    }
  };

  return (
    <div className="px-4 pt-4 pb-6 animate-fade-in">
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
        <h1 className="text-xl font-bold text-neutral-100 tracking-tight">Settings</h1>
      </div>

      {/* Profile */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 mb-4 card-hover">
        <div className="flex items-center gap-2 mb-3">
          <User size={14} className="text-green-500" />
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Profile</h2>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">Your Name</label>
          <input
            type="text"
            value={settings.userName}
            onChange={e => updateSettings({ userName: e.target.value })}
            placeholder="Enter your name..."
            className="w-full bg-[#050505] border border-[#222] rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-700 focus:outline-none focus:border-green-500/40 transition-colors"
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 mb-4 card-hover">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={14} className="text-green-500" />
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Reminders</h2>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-neutral-200 font-medium">Daily Reminder</p>
            <p className="text-[10px] text-neutral-600 mt-0.5">Get notified to log your day</p>
          </div>
          <button
            onClick={handleNotificationToggle}
            className={`toggle-track rounded-full relative transition-colors ${
              settings.reminderEnabled ? 'bg-green-600' : 'bg-neutral-700'
            }`}
            style={{ width: 44, height: 24 }}
          >
            <div
              className="toggle-thumb absolute top-[3px] rounded-full bg-white shadow"
              style={{
                width: 18,
                height: 18,
                transform: settings.reminderEnabled ? 'translateX(23px)' : 'translateX(3px)',
              }}
            />
          </button>
        </div>

        {/* Time picker */}
        {settings.reminderEnabled && (
          <div className="animate-fade-in space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Reminder Time</label>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={e => updateSettings({ reminderTime: e.target.value })}
                className="w-full bg-[#050505] border border-[#222] rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-green-500/40 transition-colors"
              />
            </div>
            <button
              onClick={sendTestNotification}
              className="btn-press w-full py-2.5 rounded-xl text-xs font-medium border border-[#222] text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-all"
            >
              Send Test Notification
            </button>
          </div>
        )}
      </div>

      {/* Data */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 mb-4 card-hover">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={14} className="text-green-500" />
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Data</h2>
        </div>
        <p className="text-[11px] text-neutral-600 mb-3">
          All data is stored locally on your device. No data is sent to any server.
        </p>
        <button
          onClick={handleReset}
          className={`btn-press w-full py-2.5 rounded-xl text-xs font-medium border transition-all ${
            showResetConfirm
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'border-[#222] text-neutral-500 hover:text-red-400 hover:border-red-500/20'
          }`}
        >
          <span className="flex items-center justify-center gap-1.5">
            <Trash2 size={13} />
            {showResetConfirm ? 'Tap again to confirm reset' : 'Reset All Data'}
          </span>
        </button>
      </div>

      {/* About */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 card-hover">
        <div className="flex items-center gap-2 mb-3">
          <Info size={14} className="text-green-500" />
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">About</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">Version</span>
            <span className="text-xs text-neutral-600">1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">Storage</span>
            <span className="text-xs text-neutral-600">Local (offline-first)</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[#1a1a1a] text-center">
          <p className="text-[10px] text-neutral-700 flex items-center justify-center gap-1">
            Made with <Heart size={8} className="text-red-500" /> for discipline & consistency
          </p>
        </div>
      </div>
    </div>
  );
}
