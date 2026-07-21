import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha,
  Tooltip,
  LinearProgress,
  useMediaQuery,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as ChecklistIcon,
} from '@mui/icons-material';
import { Task, PRIORITY_CONFIG } from '../../types';
import { useApp } from '../../context/AppContext';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
  dragHandleProps?: Record<string, any>;
}

export default function TaskCard({ task, onEdit, isDragging, dragHandleProps }: TaskCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { state, deleteTask, updateTask } = useApp();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // Ensure task.tagIds is an array
  const tags = (task.tagIds || [])
    .map(id => state.tags.find(t => t.id === id))
    .filter(Boolean);

  const priorityConfig = PRIORITY_CONFIG[task.priority];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    onEdit(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    handleMenuClose();
  };

  const handleArchive = () => {
    updateTask({ ...task, archived: true });
    handleMenuClose();
  };

  return (
    <Card
      sx={{
        mb: { xs: 0.5, sm: 0.75 },
        boxShadow: isDragging ? 4 : 1,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s, border-color 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 4,
          borderColor: theme.palette.primary.main,
        },
        borderRadius: 1.5,
        overflow: 'hidden',
        ...(dragHandleProps && { ...dragHandleProps }),
      }}
    >
      <CardContent sx={{ 
        pb: '10px !important',
        px: { xs: 1.25, sm: 1.5 },
        py: { xs: 1, sm: 1.25 },
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: theme.palette.text.primary,
              lineHeight: 1.3,
            }}
            title={task.title}
          >
            {task.title}
          </Typography>
          <IconButton 
            size="small" 
            onClick={handleMenuOpen}
            sx={{ padding: { xs: '2px', sm: '4px' }, color: theme.palette.text.secondary, ml: 0.5 }}
          >
            <MoreIcon sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />
          </IconButton>
        </Box>

        {/* Priority and Due Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
          {priorityConfig && (
            <Tooltip title={priorityConfig.label} placement="top">
              <FlagIcon 
                sx={{ 
                  color: priorityConfig.color, 
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                }} 
              />
            </Tooltip>
          )}
          {task.dueDate && (
            <Tooltip title={`Due: ${format(new Date(task.dueDate), 'PPPP')}`} placement="top">
              <Chip
                icon={<CalendarIcon sx={{ fontSize: '0.75rem !important' }} />}
                label={format(new Date(task.dueDate), isMobile ? 'MMM d' : 'MMM d')}
                size="small"
                sx={{
                  height: { xs: 18, sm: 20 },
                  fontSize: { xs: '0.65rem', sm: '0.7rem' },
                  backgroundColor: isPast(new Date(task.dueDate)) ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.info.main, 0.1),
                  color: isPast(new Date(task.dueDate)) ? theme.palette.error.main : theme.palette.info.main,
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    marginLeft: '4px',
                  },
                }}
              />
            </Tooltip>
          )}
        </Box>

        {/* Task Tags */}
        {tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, mb: 0.5 }}>
            {tags.map(tag => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                sx={{
                  height: { xs: 18, sm: 20 },
                  fontSize: { xs: '0.625rem', sm: '0.68rem' },
                  backgroundColor: alpha(tag.color, 0.1),
                  color: tag.color,
                  fontWeight: 600,
                }}
              />
            ))}
          </Box>
        )}

        {/* Task Description */}
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            component="div"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.description) }}
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              maxHeight: { xs: '40px', sm: '42px' },
            }}
          />
        )}

        {/* Task Checklist Progress */}
        {task.checklist && task.checklist.length > 0 && (
          <Box sx={{ mt: { xs: 0.75, sm: 1 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.4 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' }, display: 'flex', alignItems: 'center' }}>
                <ChecklistIcon sx={{ fontSize: '0.8rem', mr: 0.3 }} />
                {task.checklist.filter(item => item.completed).length}/{task.checklist.length}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={
                (task.checklist.filter(item => item.completed).length / task.checklist.length) * 100
              }
              sx={{ height: { xs: 3, sm: 4 }, borderRadius: 1 }}
            />
          </Box>
        )}
      </CardContent>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 4,
          sx: {
            width: { xs: 180, sm: 200 },
            maxWidth: '100%',
            borderRadius: 2,
            mt: 1.5,
            boxShadow: `0 0 8px 0 ${alpha(theme.palette.divider, 0.2)}`,
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
            Edit
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleArchive}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
            Archive
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
            Delete
          </ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}
