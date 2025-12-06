import React from 'react';
import { Task, TaskPriority } from '../types';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const priorityConfig: Record<TaskPriority, { color: string, bg: string, border: string }> = {
  [TaskPriority.Low]: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-l-emerald-500' },
  [TaskPriority.Medium]: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-l-blue-500' },
  [TaskPriority.High]: { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-l-orange-500' },
  [TaskPriority.Critical]: { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-l-rose-500' },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onDelete }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No date';
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const config = priorityConfig[task.priority] || priorityConfig[TaskPriority.Medium];

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick(task)}
      className={`glass-card p-4 rounded-xl cursor-pointer group relative border-l-4 ${config.border} animate-slide-up`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${config.bg} ${config.color}`}>
          {task.priority}
        </span>
        <button
          onClick={(e) => onDelete(task.id, e)}
          className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 p-1"
          title="Delete Task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <h4 className="text-base font-bold text-slate-800 mb-1.5 leading-tight">{task.title}</h4>

      {task.description && (
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100/50">
        <div className="flex items-center text-xs font-medium text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(task.dueDate)}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;