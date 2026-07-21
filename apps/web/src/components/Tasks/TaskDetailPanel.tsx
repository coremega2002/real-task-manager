import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  TextField,
  Button,
  Divider,
  Select,
  MenuItem,
  Chip,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task, Priority, Status, PRIORITY_CONFIG } from '../../types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TaskDetailPanelProps {
  open: boolean;
  task: Task | null;
  statuses: Status[];
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ script: 'sub' }, { script: 'super' }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'script',
  'color',
  'background',
  'align',
  'list',
  'bullet',
  'indent',
  'blockquote',
  'code-block',
  'link',
  'image',
  'video',
];

// Inline styles for Quill editor
const quillWrapperStyles = `
.quill-editor-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
}

.quill-editor-wrapper .ql-toolbar {
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;
  padding: 8px 5px;
}

.quill-editor-wrapper .ql-toolbar.ql-snow {
  padding: 8px 5px;
}

.quill-editor-wrapper .ql-toolbar.ql-snow .ql-stroke {
  stroke: #444;
}

.quill-editor-wrapper .ql-toolbar.ql-snow .ql-fill {
  fill: #444;
}

.quill-editor-wrapper .ql-toolbar.ql-snow .ql-picker-label {
  color: #444;
  font-size: 13px;
}

.quill-editor-wrapper .ql-toolbar.ql-snow button:hover .ql-stroke,
.quill-editor-wrapper .ql-toolbar.ql-snow button.ql-active .ql-stroke {
  stroke: #1976d2;
}

.quill-editor-wrapper .ql-toolbar.ql-snow button:hover .ql-fill,
.quill-editor-wrapper .ql-toolbar.ql-snow button.ql-active .ql-fill {
  fill: #1976d2;
}

.quill-editor-wrapper .ql-container {
  border: none;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-size: 14px;
}

.quill-editor-wrapper .ql-editor {
  min-height: 350px;
  padding: 15px;
  line-height: 1.6;
}

.quill-editor-wrapper .ql-editor.ql-blank::before {
  color: #999;
  font-style: italic;
}

.quill-editor-wrapper .ql-editor p {
  margin-bottom: 12px;
}

.quill-editor-wrapper .ql-editor h1,
.quill-editor-wrapper .ql-editor h2,
.quill-editor-wrapper .ql-editor h3 {
  margin-bottom: 12px;
  margin-top: 12px;
}

.quill-editor-wrapper .ql-editor ul,
.quill-editor-wrapper .ql-editor ol {
  margin-bottom: 12px;
  margin-left: 20px;
}

.quill-editor-wrapper .ql-editor a {
  color: #1976d2;
}

.quill-editor-wrapper .ql-toolbar button {
  width: 32px;
  height: 32px;
}

.quill-editor-wrapper .ql-toolbar button svg {
  width: 18px;
  height: 18px;
}
`;

export default function TaskDetailPanel({
  open,
  task,
  statuses,
  onClose,
  onSave,
  onDelete,
}: TaskDetailPanelProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (task && open) {
      setEditedTask({ ...task });
    }
  }, [task, open]);

  // Inject styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = quillWrapperStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (!task || !editedTask) {
    return null;
  }

  const handleSave = () => {
    if (editedTask) {
      onSave(editedTask);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete && editedTask) {
      onDelete(editedTask.id);
      onClose();
    }
  };

  const handleDescriptionChange = (value: string) => {
    setEditedTask({ ...editedTask, description: value });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500, md: 650 },
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Edit Task Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        <Stack spacing={3}>
          {/* Title */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Title
            </Typography>
            <TextField
              fullWidth
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              placeholder="Enter task title..."
              variant="outlined"
            />
          </Box>

          {/* Status and Priority Row */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Status
              </Typography>
              <Select
                fullWidth
                value={editedTask.statusId}
                onChange={(e) => setEditedTask({ ...editedTask, statusId: e.target.value })}
              >
                {statuses.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    <Chip
                      label={status.name}
                      size="small"
                      sx={{
                        bgcolor: status.color,
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Priority
              </Typography>
              <Select
                fullWidth
                value={editedTask.priority}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, priority: e.target.value as Priority })
                }
              >
                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                  <MenuItem key={key} value={key}>
                    <Chip
                      label={config.label}
                      size="small"
                      sx={{
                        bgcolor: config.color,
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          {/* Due Date */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Due Date
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={editedTask.dueDate || ''}
              onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Divider />

          {/* Description with WYSIWYG */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Description
            </Typography>
            <Box className="quill-editor-wrapper">
              <ReactQuill
                theme="snow"
                value={editedTask.description || ''}
                onChange={handleDescriptionChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write a detailed description with rich formatting..."
              />
            </Box>
          </Box>

          {/* Metadata */}
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              Created: {new Date(editedTask.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Updated: {new Date(editedTask.updatedAt).toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          p: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 2,
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          disabled={!onDelete}
        >
          Delete
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
