import React from 'react';
import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface BoardViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (id: string, e: React.MouseEvent) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ tasks, onTaskClick, onTaskDelete, onStatusChange }) => {
  const columns = Object.values(TaskStatus);

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onStatusChange(taskId, status);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-slate-200 text-slate-700';
      case 'In Progress': return 'bg-blue-200 text-blue-700';
      case 'Done': return 'bg-emerald-200 text-emerald-700';
      default: return 'bg-slate-200 text-slate-700';
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full gap-6 overflow-x-auto pb-4 items-start">
      {columns.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);

        return (
          <div
            key={status}
            className="flex-shrink-0 w-full md:w-80 glass rounded-2xl flex flex-col max-h-[calc(100vh-220px)] transition-all duration-300 hover:shadow-xl"
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={handleDragOver}
          >
            <div className="p-4 border-b border-white/20 sticky top-0 z-10 backdrop-blur-md rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700 text-lg">{status}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(status)}`}>
                  {columnTasks.length}
                </span>
              </div>
            </div>

            <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[150px] custom-scrollbar">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={onTaskClick}
                  onDelete={onTaskDelete}
                />
              ))}
              {columnTasks.length === 0 && (
                <div className="h-32 flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200/50 rounded-xl m-2">
                  <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BoardView;
