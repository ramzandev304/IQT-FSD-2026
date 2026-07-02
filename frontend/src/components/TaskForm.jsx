import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        description: description.trim(),
        priority,
        due_date: dueDate || null,
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-row">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={255}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
      </div>
      <div className="task-form-row">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label="Priority"
          className={`priority-select priority-${priority}`}
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
        <button type="submit" className="btn-primary" disabled={submitting}>
          <Plus size={16} strokeWidth={2.5} />
          Add Task
        </button>
      </div>
    </form>
  );
}
