// Priority types
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#4caf50' },
  medium: { label: 'Medium', color: '#ff9800' },
  high: { label: 'High', color: '#f44336' },
  urgent: { label: 'Urgent', color: '#9c27b0' },
};

// Tag type
export interface Tag {
  id: string;
  name: string;
  color: string;
}

// Status type
export interface Status {
  id: string;
  name: string;
  color: string;
  order: number;
}

// Task type
export interface Task {
  id: string;
  title: string;
  description: string;
  statusId: string;
  tagIds: string[];
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  order?: number;
  archived: boolean;
}

// Board type
export interface Board {
  id: string;
  name: string;
  description?: string;
  statusIds: string[];
  createdAt: string;
  updatedAt: string;
}

// Default tags
export const DEFAULT_TAGS: Tag[] = [
  { id: 'bug', name: 'Bug', color: '#f44336' },
  { id: 'feature', name: 'Feature', color: '#2196f3' },
  { id: 'enhancement', name: 'Enhancement', color: '#4caf50' },
  { id: 'documentation', name: 'Documentation', color: '#ff9800' },
];

// Default statuses
export const DEFAULT_STATUSES: Status[] = [
  { id: 'todo', name: 'To Do', color: '#9e9e9e', order: 0 },
  { id: 'in-progress', name: 'In Progress', color: '#2196f3', order: 1 },
  { id: 'review', name: 'Review', color: '#ff9800', order: 2 },
  { id: 'done', name: 'Done', color: '#4caf50', order: 3 },
];

// App state
export interface AppState {
  tasks: Task[];
  tags: Tag[];
  statuses: Status[];
  boards: Board[];
  activeBoard: string;
  searchQuery: string;
  filterTags: string[];
  filterPriority: Priority | null;
  filterStatus: string | null;
  sortBy: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority';
  sortOrder: 'asc' | 'desc';
  theme: 'light' | 'dark';
  darkMode: boolean;
}

// App actions
export type AppAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { taskId: string; statusId: string; newOrder: number } }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTER_TAGS'; payload: string[] }
  | { type: 'SET_FILTER_PRIORITY'; payload: Priority | null }
  | { type: 'SET_FILTER_STATUS'; payload: string | null }
  | { type: 'TOGGLE_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_STATE'; payload: AppState };
