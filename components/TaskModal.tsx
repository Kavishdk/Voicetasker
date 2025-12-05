import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, ParsedTaskResponse } from '../types';
import { generateId } from '../services/taskService';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialData?: Partial<Task> | null;
  parsedData?: ParsedTaskResponse | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialData, parsedData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.Todo);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [dueDate, setDueDate] = useState('');

  // Helper to format ISO string to datetime-local input format (YYYY-MM-DDThh:mm)
  // This ensures the input always receives a value it can display
  const toLocalInputValue = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Handle invalid dates
    if (isNaN(date.getTime())) return '';
    
    // Adjust to local time for the input
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  useEffect(() => {
    if (isOpen) {
      if (parsedData) {
        // Pre-fill from AI
        setTitle(parsedData.title || '');
        setDescription(parsedData.description || '');
        
        // Map loose strings to enums if possible
        const aiStatus = Object.values(TaskStatus).find(s => s === parsedData.status) || TaskStatus.Todo;
        const aiPriority = Object.values(TaskPriority).find(p => p === parsedData.priority) || TaskPriority.Medium;
        
        setStatus(aiStatus);
        setPriority(aiPriority);
        // Normalize AI ISO date to local input format immediately
        setDueDate(parsedData.dueDate ? toLocalInputValue(parsedData.dueDate) : '');
      } else if (initialData) {
        // Edit mode
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setStatus(initialData.status || TaskStatus.Todo);
        setPriority(initialData.priority || TaskPriority.Medium);
        // Ensure existing data is compatible with input
        setDueDate(initialData.dueDate ? toLocalInputValue(initialData.dueDate) : '');
      } else {
        // New clean task
        setTitle('');
        setDescription('');
        setStatus(TaskStatus.Todo);
        setPriority(TaskPriority.Medium);
        setDueDate('');
      }
    }
  }, [isOpen, initialData, parsedData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Task = {
      id: initialData?.id || generateId(),
      title,
      description,
      status,
      priority,
      dueDate, // This will now always be in local YYYY-MM-DDThh:mm format
      createdAt: initialData?.createdAt || Date.now(),
    };
    onSave(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {initialData ? 'Edit Task' : (parsedData ? 'Review & Create Task' : 'New Task')}
                  </h3>
                  
                  {parsedData && (
                    <div className="mt-2 mb-4 p-3 bg-indigo-50 rounded-md text-sm text-indigo-700">
                      <p className="font-semibold">🎙️ Transcribed:</p>
                      <p className="italic">"{parsedData.originalTranscript}"</p>
                    </div>
                  )}

                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Review Pull Request"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add more details..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                          id="priority"
                          name="priority"
                          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as TaskPriority)}
                        >
                          {Object.values(TaskPriority).map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          id="status"
                          name="status"
                          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={status}
                          onChange={(e) => setStatus(e.target.value as TaskStatus)}
                        >
                          {Object.values(TaskStatus).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                      <input
                        type="datetime-local"
                        name="dueDate"
                        id="dueDate"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {initialData ? 'Update Task' : 'Create Task'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;