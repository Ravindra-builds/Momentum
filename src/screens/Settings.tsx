import { useState, useRef } from 'react';
import { ArrowLeft, Bell, User, Trash2, Shield, Heart, Info, Download, Upload, AlertCircle } from 'lucide-react';
import { useApp } from '../hooks/useAppData';
import { storage } from '../services/storage';

export default function Settings() {
  const { settings, updateSettings, setScreen } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'confirm' | 'success' | 'error'>('idle');
  const [importError, setImportError] = useState('');
  const [pendingImportData, setPendingImportData] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      try {
        new Notification('Momentum', {
          body: msg,
          icon: './icons/icon-192x192.png',
          badge: './icons/icon-192x192.png',
          tag: 'momentum-test',
        });
      } catch {
        alert('Notification failed. Your browser may not support this feature.');
      }
    }
  };

  // ── Backup Export ──
  const handleExport = () => {
    try {
      const json = storage.exportBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().split('T')[0];
      a.download = `momentum-backup-${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export backup.');
    }
  };

  // ── Backup Import ──
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setPendingImportData(text);
      setImportStatus('confirm');
      setImportError('');
    };
    reader.onerror = () => {
      setImportError('Failed to read file.');
      setImportStatus('error');
    };
    reader.readAsText(file);

    // Reset file input so same file can be re-selected
    e.target.value = '';
  };

  const confirmImport = () => {
    const result = storage.importBackup(pendingImportData);
    if (result.ok) {
      setImportStatus('success');
      setPendingImportData('');
      // Reload after short delay so user sees the success message
      setTimeout(() => window.location.reload(), 800);
    } else {
      setImportError(result.error);
      setImportStatus('error');
    }
  };

  const cancelImport = () => {
    setImportStatus('idle');
    setPendingImportData('');
    setImportError('');
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

      {/* ── Backup & Restore ── */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 mb-4 card-hover">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={14} className="text-green-500" />
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Backup & Restore</h2>
        </div>
        <p className="text-[11px] text-neutral-600 mb-4">
          Export your data to a file for safekeeping. Import to restore from a backup.
        </p>

        {/* Import success message */}
        {importStatus === 'success' && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-400 flex items-center gap-2 animate-fade-in">
            <span>✓</span> Backup restored! Reloading...
          </div>
        )}

        {/* Import error message */}
        {importStatus === 'error' && importError && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2 animate-fade-in">
            <AlertCircle size={12} /> {importError}
          </div>
        )}

        {/* Import confirmation */}
        {importStatus === 'confirm' && (
          <div className="mb-3 px-3 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 animate-fade-in">
            <p className="text-xs text-yellow-400 font-medium mb-2 flex items-center gap-1.5">
              <AlertCircle size={12} /> This will replace your current data
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmImport}
                className="btn-press flex-1 py-2 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-500 transition-colors"
              >
                Restore
              </button>
              <button
                onClick={cancelImport}
                className="btn-press flex-1 py-2 rounded-lg text-xs font-medium bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {/* Export */}
          <button
            onClick={handleExport}
            className="btn-press flex-1 py-2.5 rounded-xl text-xs font-medium border border-[#222] text-neutral-400 hover:text-green-400 hover:border-green-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Download size={13} />
            Export Backup
          </button>

          {/* Import */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-press flex-1 py-2.5 rounded-xl text-xs font-medium border border-[#222] text-neutral-400 hover:text-blue-400 hover:border-blue-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Upload size={13} />
            Import Backup
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Data */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 mb-4 card-hover">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 size={14} className="text-neutral-500" />
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Danger Zone</h2>
        </div>
        <p className="text-[11px] text-neutral-600 mb-3">
          This will permanently delete all your data. Export a backup first if needed.
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
            <span className="text-xs text-neutral-600">1.1.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">Storage</span>
            <span className="text-xs text-neutral-600">Local (offline-first)</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[#1a1a1a] text-center">
          <p className="text-[10px] text-neutral-700 flex items-center justify-center gap-1">
            Made with <Heart size={10} className="text-red-500" /> for discipline & consistency
          </p>
        </div>
      </div>
    </div>
  );
}
