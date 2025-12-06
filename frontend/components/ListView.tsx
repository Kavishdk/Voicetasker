import React from 'react';
import { Task, TaskPriority } from '../types';

interface ListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (id: string, e: React.MouseEvent) => void;
}

const priorityConfig: Record<TaskPriority, string> = {
  [TaskPriority.Low]: 'text-emerald-400 bg-emerald-900/30 ring-1 ring-emerald-500/30',
  [TaskPriority.Medium]: 'text-blue-400 bg-blue-900/30 ring-1 ring-blue-500/30',
  [TaskPriority.High]: 'text-orange-400 bg-orange-900/30 ring-1 ring-orange-500/30',
  [TaskPriority.Critical]: 'text-rose-400 bg-rose-900/30 ring-1 ring-rose-500/30',
};

const ListView: React.FC<ListViewProps> = ({ tasks, onTaskClick, onTaskDelete }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="glass rounded-2xl overflow-hidden shadow-xl animate-slide-up">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-slate-900/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Due Date</th>
              <th scope="col" className="relative px-6 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-slate-900/20">
            {tasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="hover:bg-slate-800/50 cursor-pointer transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-white">{task.title}</div>
                  {task.description && <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">{task.description}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                    ${task.status === 'Done' ? 'bg-emerald-900/50 text-emerald-300' :
                      task.status === 'In Progress' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-slate-800 text-slate-300'}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-md ${priorityConfig[task.priority]}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-medium">
                  {formatDate(task.dueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      onTaskDelete(task.id, e);
                    }}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-rose-900/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-sm text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-slate-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <p className="text-lg font-medium text-slate-300">No tasks found</p>
                    <p className="text-slate-500 mt-1">Use the voice button to create one!</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListView;