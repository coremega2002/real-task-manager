import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { Task } from '../../types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TaskDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const defaultTask: Task = {
  id: '',
  title: '',
  description: '',
  statusId: '',
  priority: 'medium',
  dueDate: '',
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function TaskDialog({ open, task, onClose, onSave }: TaskDialogProps) {
  const [editedTask, setEditedTask] = useState<Task>(defaultTask);

  useEffect(() => {
    if (task) {
      setEditedTask(task);
    }
  }, [task, open]);

  if (!task) {
    return null;
  }

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask({ ...editedTask, title: e.target.value });
  };

  const handleDescriptionChange = (value: string) => {
    setEditedTask({ ...editedTask, description: value });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={editedTask.title}
          onChange={handleTitleChange}
        />
        <div style={{ marginTop: '16px' }}>
          <ReactQuill
            value={editedTask.description}
            onChange={handleDescriptionChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
