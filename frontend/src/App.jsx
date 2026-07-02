import { useEffect, useMemo, useState } from 'react';
import { ListTodo, Moon, Search, Sun, Trash2, X } from 'lucide-react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import CurrencyConverter from './components/CurrencyConverter';
import { tasksApi } from './api';
import { useTheme } from './useTheme';
import './App.css';

const FILTERS = ['All', 'Active', 'Completed'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [theme, toggleTheme] = useTheme();

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.list();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(task) {
    const created = await tasksApi.create(task);
    setTasks((prev) => [created, ...prev]);
  }

  async function handleUpdate(id, patch) {
    const updated = await tasksApi.update(id, patch);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleDelete(id) {
    await tasksApi.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleClearCompleted() {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    await Promise.all(completedIds.map((id) => tasksApi.remove(id)));
    setTasks((prev) => prev.filter((t) => !t.completed));
  }

  const visibleTasks = useMemo(() => {
    let result = tasks;
    if (filter === 'Active') result = result.filter((t) => !t.completed);
    if (filter === 'Completed') result = result.filter((t) => t.completed);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }
    return result;
  }, [tasks, filter, search]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks]
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon">
            <ListTodo size={22} strokeWidth={2.25} />
          </span>
          <div>
            <h1>Task Manager</h1>
            <p className="subtitle">Stay on top of what matters today</p>
          </div>
        </div>

        <div className="header-right">
          <div className="stats">
            <div className="stat">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.active}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Done</span>
            </div>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      <main>
        <section className="card">
          <TaskForm onAdd={handleAdd} />

          <div className="toolbar">
            <div className="filter-tabs" role="tablist">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  className={`filter-tab${filter === f ? ' active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="search-box">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search tasks"
              />
              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {loading && <p className="status-text">Loading tasks…</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <TaskList tasks={visibleTasks} onUpdate={handleUpdate} onDelete={handleDelete} />
          )}

          {stats.completed > 0 && (
            <div className="list-footer">
              <button type="button" className="clear-completed" onClick={handleClearCompleted}>
                <Trash2 size={13} />
                Clear {stats.completed} completed
              </button>
            </div>
          )}
        </section>

        <CurrencyConverter />
      </main>
    </div>
  );
}
