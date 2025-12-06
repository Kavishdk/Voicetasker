export enum TaskStatus {
  Todo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO Date string
  createdAt: number;
}

export interface ParsedTaskResponse {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string; // ISO Date string or description like "tomorrow"
  originalTranscript: string;
}
