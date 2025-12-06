import { Task } from "../types";

const API_URL = 'http://localhost:5000/api/tasks';

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const createTask = async (task: Task): Promise<Task> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to create task');
  return await response.json();
};

export const updateTask = async (task: Task): Promise<Task> => {
  const response = await fetch(`${API_URL}/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return await response.json();
};

export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete task');
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
