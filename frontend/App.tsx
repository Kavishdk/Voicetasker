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
import { getTasks, createTask, updateTask, deleteTask } from './services/taskService';

enum ViewMode {
  Board = 'Board',
  List = 'List'
}

const App: React.FC = () => {
  // --- State Management ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Board);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Voice Input State
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [parsedVoiceData, setParsedVoiceData] = useState<ParsedTaskResponse | null>(null);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterDueDate, setFilterDueDate] = useState<string>('');

  // --- Effects ---

  // Load tasks from the backend when the component mounts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const loadedTasks = await getTasks();
        setTasks(loadedTasks);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };
    loadTasks();
  }, []);

  // --- Handlers ---

  const handleCreateTask = () => {
    setSelectedTask(null); // Clear selection for new task
    setParsedVoiceData(null); // Clear any previous voice data
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setParsedVoiceData(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (task: Task) => {
    try {
      if (selectedTask) {
        // Update existing task
        const updatedTask = await updateTask(task);
        setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      } else {
        // Create new task
        const newTask = await createTask(task);
        setTasks([...tasks, newTask]); // Optimistic update could be done here too
      }
    } catch (error) {
      console.error("Failed to save task:", error);
      alert("Failed to save task. Please ensure the backend is running.");
    }
  };

  const handleDeleteTask = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter(t => t.id !== id));
      } catch (error) {
        console.error("Failed to delete task:", error);
        alert("Failed to delete task.");
      }
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, status: newStatus };
      try {
        // Optimistic update: Update UI immediately
        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
        // Then send to backend
        await updateTask(updatedTask);
      } catch (error) {
        console.error("Failed to update status:", error);
        // Revert on failure
        setTasks(tasks.map(t => t.id === taskId ? taskToUpdate : t));
        alert("Failed to update status.");
      }
    }
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

  // --- Filtering Logic ---

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
    setFilterPriority('All');
    setFilterDueDate('');
  };

  const hasActiveFilters = searchQuery || filterStatus !== 'All' || filterPriority !== 'All' || filterDueDate;

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
    <div className="min-h-screen flex flex-col font-sans text-theme-text-main">
      {/* Background Blobs for Atmosphere */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-4 z-50 mx-4 sm:mx-8 lg:mx-auto max-w-7xl mt-4">
        <div className="glass rounded-2xl px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-theme-text-main to-theme-text-muted">
              VoiceTasker
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCreateTask}
              className="hidden sm:inline-flex items-center px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Task
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">

          {/* View Toggles */}
          <div className="glass p-1.5 rounded-xl flex items-center">
            <button
              onClick={() => setViewMode(ViewMode.Board)}
              className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${viewMode === ViewMode.Board ? 'bg-theme-paper text-theme-primary shadow-sm' : 'text-theme-text-muted hover:text-theme-text-main'}`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode(ViewMode.List)}
              className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${viewMode === ViewMode.List ? 'bg-theme-paper text-theme-primary shadow-sm' : 'text-theme-text-muted hover:text-theme-text-main'}`}
            >
              List
            </button>
          </div>

          {/* Filters Group */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full lg:w-auto">

            {/* Search */}
            <div className="relative flex-1 min-w-[240px] w-full sm:w-auto group">
              <input
                type="text"
                placeholder="Search tasks..."
                className="input-field block w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-theme-text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field block w-full cursor-pointer"
              >
                <option value="All">All Status</option>
                {Object.values(TaskStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative w-full sm:w-auto">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="input-field block w-full cursor-pointer"
              >
                <option value="All">All Priority</option>
                {Object.values(TaskPriority).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <input
              type="date"
              value={filterDueDate}
              onChange={(e) => setFilterDueDate(e.target.value)}
              className="input-field block w-full sm:w-auto"
            />

            {/* Clear Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-theme-text-muted hover:text-theme-primary font-semibold px-3 py-1 rounded-lg hover:bg-theme-paper transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Views */}
        <div className="h-full animate-fade-in">
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
      <div className="fixed bottom-8 right-8 flex flex-col items-center gap-6 z-40">

        {/* Loading Indicator for Voice */}
        {isProcessingVoice && (
          <div className="glass px-6 py-3 rounded-2xl shadow-xl animate-pulse flex items-center gap-3 text-indigo-700 font-medium">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
            Processing...
          </div>
        )}

        <VoiceRecorder
          onProcessingStart={handleVoiceProcessingStart}
          onProcessingComplete={handleVoiceProcessingComplete}
          onError={handleVoiceError}
        />

        {/* Mobile New Task FAB */}
        <button
          onClick={handleCreateTask}
          className="sm:hidden p-4 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all transform hover:scale-110 active:scale-95"
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