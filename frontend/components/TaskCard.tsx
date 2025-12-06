import React from 'react';
import { Task, TaskPriority } from '../types';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  [TaskPriority.Low]: 'bg-green-100 text-green-800',
  [TaskPriority.Medium]: 'bg-blue-100 text-blue-800',
  [TaskPriority.High]: 'bg-orange-100 text-orange-800',
  [TaskPriority.Critical]: 'bg-red-100 text-red-800',
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

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick(task)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group relative"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <button 
            onClick={(e) => onDelete(task.id, e)}
            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete Task"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
      </div>
      <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{task.title}</h4>
      {task.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-400">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
           {formatDate(task.dueDate)}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;