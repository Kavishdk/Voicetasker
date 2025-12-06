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
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">

        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom glass rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full animate-fade-in">
          <form onSubmit={handleSubmit}>
            <div className="px-6 pt-6 pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6" id="modal-title">
                    {initialData ? 'Edit Task' : (parsedData ? 'Review & Create Task' : 'New Task')}
                  </h3>

                  {parsedData && (
                    <div className="mb-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-sm text-indigo-800">
                      <p className="font-bold mb-1 flex items-center gap-2">
                        <span className="text-lg">🎙️</span> Transcribed:
                      </p>
                      <p className="italic text-indigo-600">"{parsedData.originalTranscript}"</p>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-1.5">Title</label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="block w-full rounded-xl border-slate-200 bg-white/50 focus:bg-white py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Review Pull Request"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="block w-full rounded-xl border-slate-200 bg-white/50 focus:bg-white py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add more details..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="priority" className="block text-sm font-bold text-slate-700 mb-1.5">Priority</label>
                        <select
                          id="priority"
                          name="priority"
                          className="block w-full rounded-xl border-slate-200 bg-white/50 focus:bg-white py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as TaskPriority)}
                        >
                          {Object.values(TaskPriority).map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="status" className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
                        <select
                          id="status"
                          name="status"
                          className="block w-full rounded-xl border-slate-200 bg-white/50 focus:bg-white py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
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
                      <label htmlFor="dueDate" className="block text-sm font-bold text-slate-700 mb-1.5">Due Date</label>
                      <input
                        type="datetime-local"
                        name="dueDate"
                        id="dueDate"
                        className="block w-full rounded-xl border-slate-200 bg-white/50 focus:bg-white py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50/50 px-6 py-4 sm:flex sm:flex-row-reverse gap-3">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-bold text-white hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm transition-all transform hover:-translate-y-0.5"
              >
                {initialData ? 'Update Task' : 'Create Task'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-xl border border-slate-200 shadow-sm px-5 py-2.5 bg-white text-base font-bold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-all"
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