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

  return (
    <div className="flex flex-col md:flex-row h-full gap-6 overflow-x-auto pb-4">
      {columns.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        
        return (
          <div
            key={status}
            className="flex-shrink-0 w-full md:w-80 bg-gray-100 rounded-xl flex flex-col max-h-[calc(100vh-200px)]"
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={handleDragOver}
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">{status}</h3>
                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {columnTasks.length}
                </span>
              </div>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[150px]">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={onTaskClick}
                  onDelete={onTaskDelete}
                />
              ))}
              {columnTasks.length === 0 && (
                 <div className="h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-lg p-4">
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
