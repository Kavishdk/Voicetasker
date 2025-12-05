import { Task } from "../types";

const STORAGE_KEY = 'voice_task_tracker_data';

export const getTasks = (): Task[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
