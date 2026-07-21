import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_STATUSES, DEFAULT_TAGS } from '../types';
import { useAuth } from './AuthContext';
import {
  deleteTaskRow,
  fetchTasks,
  insertTask,
  updateTaskRow,
} from '../lib/taskBackend';

const AppContext = createContext<any>(null);

const initialState = {
  tasks: [],
  theme: 'light',
  tags: DEFAULT_TAGS,
  statuses: DEFAULT_STATUSES,
  searchQuery: '',
  selectedTags: [],
  selectedPriorities: [],
  selectedStatuses: [],
  tasksLoading: false,
  tasksError: null as string | null,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, tasksLoading: false, tasksError: null };
    case 'SET_TASKS_ERROR':
      return { ...state, tasksError: action.payload, tasksLoading: false };
    case 'SET_TASKS_LOADING':
      return { ...state, tasksLoading: true };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task: any) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task: any) => task.id !== action.payload),
      };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_TAGS':
      return { ...state, selectedTags: action.payload };
    case 'SET_SELECTED_PRIORITIES':
      return { ...state, selectedPriorities: action.payload };
    case 'SET_SELECTED_STATUSES':
      return { ...state, selectedStatuses: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();

  const reloadTasks = useCallback(async () => {
    if (!user) return;
    dispatch({ type: 'SET_TASKS_LOADING' });
    try {
      const tasks = await fetchTasks();
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (e) {
      dispatch({
        type: 'SET_TASKS_ERROR',
        payload: e instanceof Error ? e.message : String(e),
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) void reloadTasks();
    else dispatch({ type: 'SET_TASKS', payload: [] });
  }, [user, reloadTasks]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    dispatch({ type: 'SET_THEME', payload: savedTheme });
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', state.theme);
  }, [state.theme]);

  const addTask = (task: any) => {
    const newTask = { ...task, id: task.id || uuidv4() };
    void (async () => {
      try {
        const saved = await insertTask(newTask, user?.id);
        dispatch({ type: 'ADD_TASK', payload: saved });
      } catch (e) {
        console.error('Error adding task:', e);
        dispatch({
          type: 'SET_TASKS_ERROR',
          payload: e instanceof Error ? e.message : String(e),
        });
      }
    })();
  };

  const updateTask = (task: any) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
    void updateTaskRow(task, user?.id).catch((e) => {
      console.error('Error updating task:', e);
      void reloadTasks();
    });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
    void deleteTaskRow(id).catch((e) => {
      console.error('Error deleting task:', e);
      void reloadTasks();
    });
  };

  const moveTask = (id: string, statusId: string, order: number) => {
    const task = state.tasks.find((t: any) => t.id === id);
    if (task) updateTask({ ...task, statusId, order });
  };

  const setTheme = (theme: string) => dispatch({ type: 'SET_THEME', payload: theme });
  const setSearchQuery = (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  const setSelectedTags = (tags: string[]) => dispatch({ type: 'SET_SELECTED_TAGS', payload: tags });
  const setSelectedPriorities = (p: string[]) =>
    dispatch({ type: 'SET_SELECTED_PRIORITIES', payload: p });
  const setSelectedStatuses = (s: string[]) =>
    dispatch({ type: 'SET_SELECTED_STATUSES', payload: s });

  const getTasksByStatus = (statusId: string) =>
    state.tasks.filter((task: any) => task.statusId === statusId);

  const getFilteredTasks = () =>
    state.tasks.filter((task: any) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(state.searchQuery.toLowerCase());
      const matchesTags =
        state.selectedTags.length === 0 ||
        task.tagIds.some((tag: string) => state.selectedTags.includes(tag));
      const matchesPriorities =
        state.selectedPriorities.length === 0 ||
        state.selectedPriorities.includes(task.priority);
      const matchesStatuses =
        state.selectedStatuses.length === 0 ||
        state.selectedStatuses.includes(task.statusId);
      return matchesSearch && matchesTags && matchesPriorities && matchesStatuses;
    });

  return (
    <AppContext.Provider
      value={{
        state,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        setTheme,
        setSearchQuery,
        setSelectedTags,
        setSelectedPriorities,
        setSelectedStatuses,
        getTasksByStatus,
        getFilteredTasks,
        reloadTasks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
