import { useState } from 'react';
import { Calendar, Check, Pencil, Trash2, X } from 'lucide-react';

const PRIORITY_LABEL = { low: 'Low', medium: 'Medium', high: 'High' };

function formatDueDate(dateStr) {
  const d = new Date(`${dateStr.slice(0, 10)}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function isOverdue(dateStr, completed) {
  if (!dateStr || completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${dateStr.slice(0, 10)}T00:00:00`) < today;
}

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [dueDate, setDueDate] = useState(task.due_date ? task.due_date.slice(0, 10) : '');

  async function saveEdit() {
    if (!title.trim()) return;
    await onUpdate(task.id, {
      title: title.trim(),
      description: description.trim(),
      priority,
      due_date: dueDate || null,
    });
    setEditing(false);
  }

  function cancelEdit() {
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority || 'medium');
    setDueDate(task.due_date ? task.due_date.slice(0, 10) : '');
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="task-item editing">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          maxLength={255}
          autoFocus
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          maxLength={500}
        />
        <div className="task-form-row">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={`priority-select priority-${priority}`}
            aria-label="Priority"
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="Due date"
          />
        </div>
        <div className="task-actions">
          <button className="btn-primary" onClick={saveEdit}>
            Save
          </button>
          <button className="icon-btn" onClick={cancelEdit} aria-label="Cancel edit">
            <X size={16} />
          </button>
        </div>
      </li>
    );
  }

  const overdue = isOverdue(task.due_date, task.completed);

  return (
    <li className={`task-item${task.completed ? ' completed' : ''}`}>
      <button
        type="button"
        className={`check-toggle${task.completed ? ' checked' : ''}`}
        onClick={() => onUpdate(task.id, { completed: !task.completed })}
        aria-label={task.completed ? 'Mark as active' : 'Mark as completed'}
      >
        {task.completed && <Check size={14} strokeWidth={3} />}
      </button>

      <div className="task-body">
        <div className="task-title-row">
          <span className="task-title">{task.title}</span>
          <span className={`priority-badge priority-${task.priority || 'medium'}`}>
            {PRIORITY_LABEL[task.priority] || 'Medium'}
          </span>
          {task.due_date && (
            <span className={`due-badge${overdue ? ' overdue' : ''}`}>
              <Calendar size={11} strokeWidth={2.25} />
              {formatDueDate(task.due_date)}
            </span>
          )}
        </div>
        {task.description && (
          <div className="task-description" title={task.description}>
            {task.description}
          </div>
        )}
      </div>

      <div className="task-actions">
        <button className="icon-btn" onClick={() => setEditing(true)} aria-label="Edit task">
          <Pencil size={15} />
        </button>
        <button
          className="icon-btn danger"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </li>
  );
}
