/**
 * VoiceTasker - Main Application Component
 * 
 * This component serves as the entry point for the application, managing the global state
 * for tasks, view modes, and voice interaction. It coordinates the Board and List views
 * and handles the integration with the VoiceRecorder component.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority, ParsedTaskResponse } from './types';
import BoardView from './components/BoardView';
import ListView from './components/ListView';
import TaskModal from './components/TaskModal';
import VoiceRecorder from './components/VoiceRecorder';
import { getTasks, saveTasks } from './services/taskService';

enum ViewMode {
  Board = 'Board',
  List = 'List'
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Board);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Voice Input State
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [parsedVoiceData, setParsedVoiceData] = useState<ParsedTaskResponse | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterDueDate, setFilterDueDate] = useState<string>('');

  // Load tasks on mount
  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  }, []);

  // Save tasks on change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleCreateTask = () => {
    setSelectedTask(null);
    setParsedVoiceData(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setParsedVoiceData(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    if (selectedTask) {
      // Update
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      // Create
      setTasks([...tasks, task]);
    }
  };

  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  // Voice Processing Handlers
  const handleVoiceProcessingStart = () => {
    setIsProcessingVoice(true);
  };

  const handleVoiceProcessingComplete = (result: ParsedTaskResponse) => {
    setIsProcessingVoice(false);
    setParsedVoiceData(result);
    setSelectedTask(null); // Ensure we are in "Create" mode
    setIsModalOpen(true);
  };

  const handleVoiceError = (error: string) => {
    setIsProcessingVoice(false);
    alert(error);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
    setFilterPriority('All');
    setFilterDueDate('');
  };

  const hasActiveFilters = searchQuery || filterStatus !== 'All' || filterPriority !== 'All' || filterDueDate;

  // Filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;

      // Date filter (exact match on YYYY-MM-DD)
      const taskDate = task.dueDate ? task.dueDate.split('T')[0] : '';
      const matchesDueDate = !filterDueDate || taskDate === filterDueDate;

      return matchesSearch && matchesStatus && matchesPriority && matchesDueDate;
    });
  }, [tasks, searchQuery, filterStatus, filterPriority, filterDueDate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">VoiceTasker</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleCreateTask}
                className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Task
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">

          {/* View Toggles */}
          <div className="flex items-center bg-white rounded-lg shadow-sm p-1 border border-gray-200">
            <button
              onClick={() => setViewMode(ViewMode.Board)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === ViewMode.Board ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode(ViewMode.List)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === ViewMode.List ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}
            >
              List
            </button>
          </div>

          {/* Filters Group */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full lg:w-auto">

            {/* Search */}
            <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search tasks..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-4 pr-10 py-2 border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border pl-2 pr-8"
            >
              <option value="All">All Status</option>
              {Object.values(TaskStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border pl-2 pr-8"
            >
              <option value="All">All Priority</option>
              {Object.values(TaskPriority).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={filterDueDate}
              onChange={(e) => setFilterDueDate(e.target.value)}
              className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border px-3"
              placeholder="Due Date"
            />

            {/* Clear Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-indigo-600 font-medium px-2 whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Views */}
        <div className="h-full">
          {viewMode === ViewMode.Board ? (
            <BoardView
              tasks={filteredTasks}
              onTaskClick={handleEditTask}
              onTaskDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <ListView
              tasks={filteredTasks}
              onTaskClick={handleEditTask}
              onTaskDelete={handleDeleteTask}
            />
          )}
        </div>
      </main>

      {/* Floating Action Button (Mobile) & Voice Input */}
      <div className="fixed bottom-8 right-8 flex flex-col items-center gap-4 z-30">

        {/* Loading Indicator for Voice */}
        {isProcessingVoice && (
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse mb-2">
            Parsing voice command...
          </div>
        )}

        <VoiceRecorder
          onProcessingStart={handleVoiceProcessingStart}
          onProcessingComplete={handleVoiceProcessingComplete}
          onError={handleVoiceError}
        />

        {/* Mobile New Task FAB (Visible only on small screens) */}
        <button
          onClick={handleCreateTask}
          className="sm:hidden p-4 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialData={selectedTask}
        parsedData={parsedVoiceData}
      />
    </div>
  );
};

export default App;