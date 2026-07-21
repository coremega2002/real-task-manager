import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, IconButton, Chip, useTheme, useMediaQuery, alpha } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Add as AddIcon, MoreHoriz as MoreIcon } from '@mui/icons-material';
import { useTaskApi } from '../../hooks/useTaskApi';
import { Task } from '../../types';
import TaskCard from '../Tasks/TaskCard';
import TaskDialog from '../Tasks/TaskDialog';

export default function KanbanBoard({ handleAddTask, handleEditTask }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { tasks, fetchTasks, addTask, updateTask, deleteTask } = useTaskApi();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultStatusId, setDefaultStatusId] = useState<string | undefined>();

  useEffect(() => {
    fetchTasks();
  }, []);

  // Memoize sorted statuses to prevent re-registration of Droppables during drag
  const sortedStatuses = useMemo(() => {
    console.log('Loaded statuses:', tasks);
    return [...tasks].sort((a, b) => a.order - b.order);
  }, [tasks]);

  console.log('Checking Droppables:', sortedStatuses.map(status => status.id));

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    console.log('Drag ended:', result);

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Move task to new status
    updateTask(draggableId, { statusId: destination.droppableId });
  };

  const handleCloseDialog = () => {
    setTaskDialogOpen(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: { xs: 1.5, sm: 2 },
          p: { xs: 1, sm: 2 },
          flex: 1,
          overflowX: isMobile ? 'hidden' : 'auto',
          overflowY: isMobile ? 'auto' : 'hidden',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          '&::-webkit-scrollbar': {
            height: 8,
            width: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.background.default,
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.divider,
            borderRadius: 4,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
        }}
      >
        {sortedStatuses.map((status) => {
          const statusColor = status.color || theme.palette.grey[500];

          console.log(`Rendering Droppable for status: ${status.id}`);

          return (
            <Droppable
              key={status.id}
              droppableId={status.id}
              type="TASK"
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minWidth: isMobile ? '100%' : 320,
                    maxWidth: isMobile ? '100%' : 320,
                  }}
                >
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
                          label={tasks.filter(task => task.statusId === status.id).length}
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
                          onClick={() => handleAddTask(status.id)}
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
                      {tasks.filter(task => task.statusId === status.id).map((task, index) => (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Box 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ mb: { xs: 1, sm: 1.5 } }}
                            >
                              <TaskCard
                                task={task}
                                onEdit={handleEditTask}
                              />
                            </Box>
                          )}
                        </Draggable>
                      ))}

                      {/* Placeholder - must be inside droppable */}
                      {provided.placeholder}

                      {/* Add Task Button at bottom */}
                      {tasks.filter(task => task.statusId === status.id).length === 0 && (
                        <Box
                          onClick={() => handleAddTask(status.id)}
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
                </div>
              )}
            </Droppable>
          );
        })}
      </Box>

      <TaskDialog
        open={taskDialogOpen}
        onClose={handleCloseDialog}
        task={selectedTask}
        defaultStatusId={defaultStatusId}
      />
    </DragDropContext>
  );
}
