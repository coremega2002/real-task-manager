import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Box } from '@mui/material';
import { TopBar } from '../components/Layout';
import { KanbanBoard } from '../components/Kanban';
import { TaskDialog } from '../components/Tasks';
import { useTaskApi } from '../hooks/useTaskApi';

export default function BoardPage() {
  const { tasks, fetchTasks, addTask, updateTask, deleteTask } = useTaskApi();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [defaultStatusId, setDefaultStatusId] = useState<string | undefined>();

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = (statusId: string) => {
    const newTask = {
      id: uuidv4(),
      title: 'New Task',
      description: '',
      statusId: statusId,
      tagIds: [],
      priority: 'low',
      dueDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 0,
      archived: false,
      checklist: [],
      attachments: [],
      comments: []
    };
    addTask(newTask);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleAddClick = () => {
    setSelectedTask(null);
    setDefaultStatusId(tasks.find(s => s.isDefault)?.id);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Kanban Board" onAddClick={handleAddClick} />
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <KanbanBoard handleAddTask={handleAddTask} handleEditTask={handleEditTask} />
      </Box>
      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        defaultStatusId={tasks.find(s => s.isDefault)?.id}
      />
    </Box>
  );
}
