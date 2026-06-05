import { useState } from 'react';
import { Plus, Check, Trash2, Calendar, ListTodo } from 'lucide-react';
import { useApp } from '../hooks/useAppData';
import { getToday, getTomorrow } from '../utils/date';
import Modal from '../components/Modal';

export default function Todos() {
  const { addTodo, toggleTodo, deleteTodo, getTodosForDate } = useApp();

  const today = getToday();
  const tomorrow = getTomorrow();
  const [tab, setTab] = useState<'today' | 'tomorrow'>('today');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState<'today' | 'tomorrow'>('today');

  const todayTodos = getTodosForDate(today);
  const tomorrowTodos = getTodosForDate(tomorrow);

  const activeTodos = todayTodos.filter(t => !t.completed);
  const completedTodos = todayTodos.filter(t => t.completed);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTodo(newTitle.trim(), newTarget);
    setNewTitle('');
    setShowModal(false);
  };

  const openAddModal = (target: 'today' | 'tomorrow') => {
    setNewTarget(target);
    setNewTitle('');
    setShowModal(true);
  };

  return (
    <div className="px-4 pt-4 pb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-neutral-100 tracking-tight flex items-center gap-2">
          <ListTodo size={20} className="text-green-500" />
          Todos
        </h1>
        <button
          onClick={() => openAddModal(tab)}
          className="btn-press flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-500/10 text-green-500 text-sm font-medium hover:bg-green-500/15 transition-colors"
        >
          <Plus size={15} /> Add
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-1">
        {(['today', 'tomorrow'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn-press flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              tab === t
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'text-neutral-500 hover:text-neutral-300 border border-transparent'
            }`}
          >
            {t === 'today' ? '📝 Today' : '📅 Tomorrow'}
          </button>
        ))}
      </div>

      {/* Today Tab */}
      {tab === 'today' && (
        <div className="space-y-2">
          {activeTodos.length === 0 && completedTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-neutral-600 text-sm">No todos for today</p>
              <p className="text-neutral-700 text-xs mt-1">Tap + to plan your day</p>
            </div>
          ) : (
            <>
              {/* Active Todos */}
              {activeTodos.length > 0 && (
                <div className="space-y-2 stagger-children">
                  {activeTodos.map(todo => (
                    <div
                      key={todo.id}
                      className="group flex items-center gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-3.5 card-hover"
                    >
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="btn-press flex-shrink-0 w-6 h-6 rounded-lg border-2 border-neutral-700 hover:border-green-500/50 transition-all"
                      />
                      <span className="flex-1 text-sm text-neutral-200 min-w-0 truncate">
                        {todo.title}
                      </span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-700 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Todos */}
              {completedTodos.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-neutral-600 mb-2 font-medium">
                    Completed ({completedTodos.length})
                  </p>
                  <div className="space-y-2 stagger-children">
                    {completedTodos.map(todo => (
                      <div
                        key={todo.id}
                        className="group flex items-center gap-3 bg-[#0a0a0a] border border-green-500/10 rounded-xl p-3.5"
                      >
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className="btn-press flex-shrink-0 w-6 h-6 rounded-lg bg-green-500/20 border-2 border-green-500/30 flex items-center justify-center transition-all"
                        >
                          <Check size={12} className="text-green-500" />
                        </button>
                        <span className="flex-1 text-sm text-neutral-600 line-through min-w-0 truncate">
                          {todo.title}
                        </span>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-neutral-700 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Tomorrow Tab */}
      {tab === 'tomorrow' && (
        <div className="space-y-2">
          {tomorrowTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-3xl mb-2">🔮</div>
              <p className="text-neutral-600 text-sm">Nothing planned for tomorrow</p>
              <p className="text-neutral-700 text-xs mt-1">Plan ahead for a productive day</p>
            </div>
          ) : (
            <div className="space-y-2 stagger-children">
              {tomorrowTodos.map(todo => (
                <div
                  key={todo.id}
                  className="group flex items-center gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-3.5 opacity-60"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg border-2 border-neutral-800 flex items-center justify-center">
                    <Calendar size={10} className="text-neutral-700" />
                  </div>
                  <span className="flex-1 text-sm text-neutral-500 min-w-0 truncate">
                    {todo.title}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-neutral-700 font-medium px-1.5 py-0.5 rounded bg-neutral-900">
                      Tomorrow
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-neutral-700 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="New Todo"
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">What do you need to do?</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Enter task..."
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-700 focus:outline-none focus:border-green-500/40 transition-colors"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>

          {/* Target */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">When?</label>
            <div className="flex gap-2">
              <button
                onClick={() => setNewTarget('today')}
                className={`btn-press flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                  newTarget === 'today'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-[#0a0a0a] border-[#222] text-neutral-500'
                }`}
              >
                📝 Today
              </button>
              <button
                onClick={() => setNewTarget('tomorrow')}
                className={`btn-press flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                  newTarget === 'tomorrow'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-[#0a0a0a] border-[#222] text-neutral-500'
                }`}
              >
                📅 Tomorrow
              </button>
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleAdd}
            disabled={!newTitle.trim()}
            className="btn-press w-full py-3 rounded-xl text-sm font-semibold transition-all bg-green-600 text-white hover:bg-green-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Add Todo
          </button>
        </div>
      </Modal>
    </div>
  );
}
