import React from 'react';
import {
  Box,
  Button,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

export default function TaskActions() {
  const { addTask } = useApp();

  const handleAddTask = () => {
    addTask({
      title: 'New Task',
      description: '',
      statusId: 'todo',
      tagIds: [],
      priority: 'medium',
      dueDate: null,
      checklist: [],
      archived: false,
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddTask}>
        Add Task
      </Button>
      <IconButton color="error" size="small">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}
