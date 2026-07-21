import { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { useApp } from '../context/AppContext';
import NavBar from '../components/NavBar';
import TaskFilter from '../components/Tasks/TaskFilter';
import TaskTable from '../components/Tasks/TaskTable';
import TaskDetailPanel from '../components/Tasks/TaskDetailPanel';
import { Task } from '../types';
import TaskListHeader from '../components/Tasks/TaskListHeader';

export default function TasksPage() {
  const { state, updateTask, deleteTask } = useApp();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [priorities, setPriorities] = useState<string[]>([]);

  const tasks = useMemo(() => {
    return (state.tasks || []).filter((task) => {
      const matchesPriorities = priorities.length === 0 || priorities.includes(task.priority);
      return matchesPriorities;
    });
  }, [state.tasks, priorities]);

  const handleAddClick = () => {
    setSelectedTask(null);
    setPanelOpen(true);
  };

  const handleFilter = (filters: any) => {
    if (filters.priorities) {
      setPriorities(filters.priorities);
    }
  };

  const handleTaskUpdate = (task: Task) => {
    updateTask({ ...task, updatedAt: new Date().toISOString() });
  };

  const handleTaskReorder = (reorderedTasks: Task[]) => {
    reorderedTasks.forEach((task) => {
      updateTask(task);
    });
  };

  const handleEditDetails = (task: Task) => {
    setSelectedTask(task);
    setPanelOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    updateTask({ ...task, updatedAt: new Date().toISOString() });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TaskListHeader 
        onAddClick={handleAddClick} 
        onFilterClick={() => {}} 
        onSortClick={() => {}} 
      />

      <Box sx={{ flex: 1, overflow: 'auto', p: 3, bgcolor: 'grey.50' }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>

          <Box sx={{ mt: 3 }}>
            <TaskTable
              tasks={tasks}
              statuses={state.statuses || []}
              onTaskUpdate={handleTaskUpdate}
              onTaskReorder={handleTaskReorder}
              onEditDetails={handleEditDetails}
            />
          </Box>
        </Box>
      </Box>

      <TaskDetailPanel
        open={panelOpen}
        task={selectedTask}
        statuses={state.statuses || []}
        onClose={() => setPanelOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </Box>
  );
}
