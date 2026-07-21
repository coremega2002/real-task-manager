import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  useTheme,
  alpha,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreHoriz as MoreIcon,
} from '@mui/icons-material';
import { Draggable } from 'react-beautiful-dnd';
import { Status, Task } from '../../types';
import TaskCard from '../Tasks/TaskCard';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  onAddTask: (statusId: string) => void;
  onEditTask: (task: Task) => void;
}

export default function KanbanColumn({
  status,
  tasks,
  onAddTask,
  onEditTask,
}: KanbanColumnProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const statusColor = status.color || theme.palette.grey[500]; // Default to grey if undefined

  return (
    <Box
      sx={{
        minWidth: isMobile ? '100%' : 320,
        maxWidth: isMobile ? '100%' : 320,
        width: isMobile ? '100%' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? 'auto' : '100%',
        mb: isMobile ? 2 : 0,
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 0.5, sm: 1 },
          py: { xs: 1, sm: 1.5 },
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          <Box
            sx={{
              width: { xs: 12, sm: 14 },
              height: { xs: 12, sm: 14 },
              borderRadius: '50%',
              backgroundColor: statusColor,
              boxShadow: `0 0 0 3px ${alpha(statusColor, 0.2)}`,
            }}
          />
          <Typography 
            variant="subtitle1" 
            fontWeight={600}
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
          >
            {status.name}
          </Typography>
          <Chip
            label={tasks.length}
            size="small"
            sx={{
              height: { xs: 20, sm: 22 },
              minWidth: { xs: 20, sm: 22 },
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              fontWeight: 600,
              backgroundColor: alpha(theme.palette.text.primary, 0.08),
            }}
          />
        </Box>
        <Box>
          <IconButton
            size="small"
            onClick={() => onAddTask(status.id)}
            sx={{
              color: 'text.secondary',
              padding: { xs: '4px', sm: '8px' },
              '&:hover': {
                color: 'primary.main',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ 
              color: 'text.secondary',
              padding: { xs: '4px', sm: '8px' },
            }}
          >
            <MoreIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Tasks Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: { xs: 0.5, sm: 1 },
          py: 0.5,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.text.primary, 0.02),
          minHeight: isMobile ? 150 : 100,
          maxHeight: isMobile ? 400 : 'none',
        }}
      >
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
              <Box 
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                sx={{ mb: { xs: 1, sm: 1.5 } }}
              >
                <TaskCard
                  task={task}
                  onEdit={onEditTask}
                />
              </Box>
            )}
          </Draggable>
        ))}

        {/* Add Task Button at bottom */}
        {tasks.length === 0 && (
          <Box
            onClick={() => onAddTask(status.id)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              py: { xs: 2, sm: 3 },
              color: 'text.secondary',
              cursor: 'pointer',
              borderRadius: 2,
              border: `1px dashed ${theme.palette.divider}`,
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                color: 'primary.main',
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            <AddIcon fontSize="small" />
            <Typography 
              variant="body2" 
              fontWeight={500}
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              Add a task
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
