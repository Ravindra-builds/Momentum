import { useState } from 'react';
import { Plus, Lock, Trash2, Check, Flame } from 'lucide-react';
import { useApp } from '../hooks/useAppData';
import { getToday } from '../utils/date';
import Modal from '../components/Modal';

export default function Habits() {
  const {
    habits, addHabit, toggleHabitCompletion, deleteHabit, updateHabit,
    getHabitStreak,
  } = useApp();

  const today = getToday();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    type: 'good' as 'good' | 'bad',
    isPrivate: false,
    alias: '',
  });

  const goodHabits = habits.filter(h => h.type === 'good');
  const badHabits = habits.filter(h => h.type === 'bad');

  const openAdd = (type: 'good' | 'bad') => {
    setForm({ name: '', type, isPrivate: false, alias: '' });
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (id: string) => {
    const h = habits.find(x => x.id === id);
    if (!h) return;
    setForm({ name: h.name, type: h.type, isPrivate: h.isPrivate, alias: h.alias });
    setEditId(id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId) {
      updateHabit(editId, {
        name: form.name.trim(),
        type: form.type,
        isPrivate: form.isPrivate,
        alias: form.alias.trim(),
      });
    } else {
      addHabit(form.name.trim(), form.type, form.isPrivate, form.alias.trim());
    }
    setShowModal(false);
    setForm({ name: '', type: 'good', isPrivate: false, alias: '' });
    setEditId(null);
  };

  const renderHabit = (habit: typeof habits[0]) => {
    const completed = !!habit.completions[today];
    const streak = getHabitStreak(habit.id);
    const displayName = habit.isPrivate && habit.alias ? habit.alias : habit.name;
    const showBlur = habit.isPrivate && !habit.alias;

    return (
      <div
        key={habit.id}
        className={`group bg-[#0a0a0a] border rounded-xl p-3.5 card-hover transition-all ${
          completed ? 'border-green-500/20 bg-green-500/[0.03]' : 'border-[#1a1a1a]'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Completion toggle */}
          <button
            onClick={() => toggleHabitCompletion(habit.id, today)}
            className={`btn-press flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
              completed
                ? 'bg-green-500 border-green-500 text-black'
                : 'border-neutral-700 hover:border-neutral-500'
            }`}
          >
            {completed && <Check size={14} strokeWidth={3} className="animate-check-bounce" />}
          </button>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              {habit.isPrivate && (
                <Lock size={10} className="text-neutral-600 flex-shrink-0" />
              )}
              <span className={`text-sm font-medium truncate ${
                completed ? 'text-green-400' : 'text-neutral-200'
              } ${showBlur ? 'blur-text' : ''}`}>
                {showBlur ? habit.name : displayName}
              </span>
            </div>
          </div>

          {/* Streak */}
          {streak.current > 0 && (
            <div className="flex items-center gap-1 mr-1">
              <Flame size={11} className="text-orange-500" />
              <span className="text-xs font-semibold text-orange-400">{streak.current}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => openEdit(habit.id)}
              className="p-1 rounded-md text-neutral-600 hover:text-neutral-300 transition-colors text-xs"
            >
              Edit
            </button>
            <button
              onClick={() => deleteHabit(habit.id)}
              className="p-1 rounded-md text-neutral-600 hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 pt-4 pb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-neutral-100 tracking-tight">Habits</h1>
      </div>

      {/* Good Habits */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Good Habits
          </h2>
          <button
            onClick={() => openAdd('good')}
            className="btn-press flex items-center gap-1 text-xs font-medium text-green-500 hover:text-green-400 transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-2 stagger-children">
          {goodHabits.length === 0 ? (
            <div className="text-center py-8 text-neutral-700 text-sm">
              No good habits yet. Tap + to add one.
            </div>
          ) : (
            goodHabits.map(renderHabit)
          )}
        </div>
      </div>

      {/* Bad Habits Avoided */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Bad Habits Avoided
          </h2>
          <button
            onClick={() => openAdd('bad')}
            className="btn-press flex items-center gap-1 text-xs font-medium text-green-500 hover:text-green-400 transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-2 stagger-children">
          {badHabits.length === 0 ? (
            <div className="text-center py-8 text-neutral-700 text-sm">
              No bad habits tracked. Tap + to add one.
            </div>
          ) : (
            badHabits.map(renderHabit)
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => { setShowModal(false); setEditId(null); }}
        title={editId ? 'Edit Habit' : 'New Habit'}
      >
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Habit Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Study, Workout, Reading..."
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-700 focus:outline-none focus:border-green-500/40 transition-colors"
              autoFocus
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Type</label>
            <div className="flex gap-2">
              {(['good', 'bad'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`btn-press flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                    form.type === t
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-[#0a0a0a] border-[#222] text-neutral-500'
                  }`}
                >
                  {t === 'good' ? '✓ Good' : '✕ Bad'}
                </button>
              ))}
            </div>
          </div>

          {/* Private toggle */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-neutral-400">Private Habit</label>
              <button
                onClick={() => setForm(f => ({ ...f, isPrivate: !f.isPrivate }))}
                className={`toggle-track w-10 h-5.5 rounded-full relative transition-colors ${
                  form.isPrivate ? 'bg-green-600' : 'bg-neutral-700'
                }`}
                style={{ width: 40, height: 22 }}
              >
                <div
                  className="toggle-thumb absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow"
                  style={{
                    width: 18,
                    height: 18,
                    transform: form.isPrivate ? 'translateX(19px)' : 'translateX(2px)',
                  }}
                />
              </button>
            </div>
            {form.isPrivate && (
              <p className="text-[10px] text-neutral-600 mt-1">
                Name will be blurred. Add an alias to show instead.
              </p>
            )}
          </div>

          {/* Alias (if private) */}
          {form.isPrivate && (
            <div className="animate-fade-in">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Display Alias
              </label>
              <input
                type="text"
                value={form.alias}
                onChange={e => setForm(f => ({ ...f, alias: e.target.value }))}
                placeholder="e.g. Focus, Discipline, Detox..."
                className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-700 focus:outline-none focus:border-green-500/40 transition-colors"
              />
            </div>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!form.name.trim()}
            className="btn-press w-full py-3 rounded-xl text-sm font-semibold transition-all bg-green-600 text-white hover:bg-green-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {editId ? 'Update Habit' : 'Add Habit'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
