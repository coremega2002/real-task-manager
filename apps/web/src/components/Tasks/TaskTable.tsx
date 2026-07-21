import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Select,
  MenuItem,
  TextField,
  Paper,
  Typography,
} from '@mui/material';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Task, Priority, Status, PRIORITY_CONFIG } from '../../types';
import { format } from 'date-fns';

interface TaskTableProps {
  tasks: Task[];
  statuses: Status[];
  onTaskUpdate: (task: Task) => void;
  onTaskReorder: (tasks: Task[]) => void;
  onEditDetails: (task: Task) => void;
}

export default function TaskTable({ tasks, statuses, onTaskUpdate, onTaskReorder, onEditDetails }: TaskTableProps) {
  const [editingCell, setEditingCell] = useState<{ taskId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const reorderedTasks = items.map((task, index) => ({
      ...task,
      order: index,
    }));

    onTaskReorder(reorderedTasks);
  };

  const handleCellClick = (taskId: string, field: string, currentValue: string) => {
    setEditingCell({ taskId, field });
    setEditValue(currentValue);
  };

  const handleCellBlur = (task: Task, field: keyof Task) => {
    if (editValue !== task[field]) {
      onTaskUpdate({ ...task, [field]: editValue });
    }
    setEditingCell(null);
  };

  const handleStatusChange = (task: Task, newStatusId: string) => {
    onTaskUpdate({ ...task, statusId: newStatusId });
  };

  const handlePriorityChange = (task: Task, newPriority: Priority) => {
    onTaskUpdate({ ...task, priority: newPriority });
  };

  const handleDateChange = (task: Task, newDate: string) => {
    onTaskUpdate({ ...task, dueDate: newDate });
  };

  const getStatusById = (statusId: string) => {
    return statuses.find(s => s.id === statusId);
  };

  const getPriorityColor = (priority: Priority) => {
    return PRIORITY_CONFIG[priority].color;
  };

  const isEditing = (taskId: string, field: string) => {
    return editingCell?.taskId === taskId && editingCell?.field === field;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell width={40} />
              <TableCell width="35%">
                <Typography variant="subtitle2" fontWeight={600}>
                  Task
                </Typography>
              </TableCell>
              <TableCell width="15%">
                <Typography variant="subtitle2" fontWeight={600}>
                  Status
                </Typography>
              </TableCell>
              <TableCell width="15%">
                <Typography variant="subtitle2" fontWeight={600}>
                  Priority
                </Typography>
              </TableCell>
              <TableCell width="20%">
                <Typography variant="subtitle2" fontWeight={600}>
                  Due Date
                </Typography>
              </TableCell>
              <TableCell width="10%" align="center">
                <Typography variant="subtitle2" fontWeight={600}>
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <Droppable droppableId="task-table">
            {(provided) => (
              <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                          bgcolor: snapshot.isDragging ? 'action.selected' : 'inherit',
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <TableCell {...provided.dragHandleProps}>
                          <DragIndicatorIcon sx={{ color: 'text.secondary', cursor: 'grab' }} />
                        </TableCell>

                        <TableCell onClick={() => handleCellClick(task.id, 'title', task.title)}>
                          {isEditing(task.id, 'title') ? (
                            <TextField
                              autoFocus
                              fullWidth
                              size="small"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => handleCellBlur(task, 'title')}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleCellBlur(task, 'title');
                                }
                              }}
                            />
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{
                                cursor: 'pointer',
                                '&:hover': { color: 'primary.main' },
                              }}
                            >
                              {task.title}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Select
                            size="small"
                            value={task.statusId}
                            onChange={(e) => handleStatusChange(task, e.target.value)}
                            sx={{
                              minWidth: 120,
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                            }}
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
                        </TableCell>

                        <TableCell>
                          <Select
                            size="small"
                            value={task.priority}
                            onChange={(e) => handlePriorityChange(task, e.target.value as Priority)}
                            sx={{
                              minWidth: 100,
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                            }}
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
                        </TableCell>

                        <TableCell>
                          <TextField
                            type="date"
                            size="small"
                            value={task.dueDate || ''}
                            onChange={(e) => handleDateChange(task, e.target.value)}
                            InputProps={{
                              sx: {
                                '& .MuiOutlinedInput-notchedOutline': {
                                  border: 'none',
                                },
                              },
                            }}
                          />
                        </TableCell>

                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => onEditDetails(task)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.light',
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </TableContainer>
    </DragDropContext>
  );
}
