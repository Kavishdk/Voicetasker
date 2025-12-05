import React from 'react';
import { Task, TaskPriority } from '../types';

interface ListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (id: string, e: React.MouseEvent) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  [TaskPriority.Low]: 'text-green-600 bg-green-50',
  [TaskPriority.Medium]: 'text-blue-600 bg-blue-50',
  [TaskPriority.High]: 'text-orange-600 bg-orange-50',
  [TaskPriority.Critical]: 'text-red-600 bg-red-50',
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
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr 
                key={task.id} 
                onClick={() => onTaskClick(task)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{task.title}</div>
                {task.description && <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${task.status === 'Done' ? 'bg-green-100 text-green-800' : 
                    task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                  {task.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                 <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-md ${priorityColors[task.priority]}`}>
                   {task.priority}
                 </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(task.dueDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      onTaskDelete(task.id, e);
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
             <tr>
                 <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                     No tasks found. Use the microphone or "Add Task" button to create one.
                 </td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;