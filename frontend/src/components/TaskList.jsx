import { ClipboardList } from 'lucide-react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onUpdate, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={28} strokeWidth={1.5} />
        <p>No tasks here. Add one above to get started.</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}
