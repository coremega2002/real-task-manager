import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { TopBar } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export default function CalendarPage() {
  const theme = useTheme();
  const { state, getStatusById } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get tasks for a specific date
  const getTasksForDate = (date: Date): Task[] => {
    return state.tasks.filter(task => {
      if (!task.dueDate || task.archived) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDate(null);
  };

  const tasksForSelectedDate = selectedDate ? getTasksForDate(selectedDate) : [];

  // Calendar grid
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDayOfWeek = monthStart.getDay();
  const calendarDays = [
    ...Array(firstDayOfWeek).fill(null),
    ...days,
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Calendar" showAddButton={false} />

      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        <Card>
          <CardContent>
            {/* Calendar Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <IconButton onClick={handlePrevMonth}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6" fontWeight={600}>
                {format(currentDate, 'MMMM yyyy')}
              </Typography>
              <IconButton onClick={handleNextMonth}>
                <ChevronRightIcon />
              </IconButton>
            </Box>

            {/* Week Day Headers */}
            <Grid container spacing={0} sx={{ mb: 1 }}>
              {weekDays.map(day => (
                <Grid item xs={12 / 7} key={day}>
                  <Typography
                    align="center"
                    variant="body2"
                    fontWeight={600}
                    sx={{ py: 1 }}
                  >
                    {day}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {/* Calendar Days */}
            <Grid container spacing={0}>
              {calendarDays.map((day, index) => {
                const isCurrentMonth = day && isSameMonth(day, currentDate);
                const tasksForDay = day ? getTasksForDate(day) : [];
                const isSelected = selectedDate && day && isSameDay(day, selectedDate);

                return (
                  <Grid
                    item
                    xs={12 / 7}
                    key={index}
                    onClick={() => day && handleDateClick(day)}
                    sx={{
                      minHeight: 120,
                      borderRight: '1px solid',
                      borderBottom: '1px solid',
                      borderColor: theme.palette.divider,
                      p: 1,
                      cursor: day ? 'pointer' : 'default',
                      backgroundColor: isSelected
                        ? alpha(theme.palette.primary.main, 0.1)
                        : !isCurrentMonth
                        ? alpha(theme.palette.text.primary, 0.02)
                        : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': day && isCurrentMonth
                        ? {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }
                        : undefined,
                    }}
                  >
                    {day && (
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            color: isCurrentMonth ? 'text.primary' : 'text.disabled',
                            mb: 0.5,
                          }}
                        >
                          {format(day, 'd')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {tasksForDay.slice(0, 2).map(task => {
                            const status = getStatusById(task.statusId);
                            return (
                              <Chip
                                key={task.id}
                                label={task.title}
                                size="small"
                                sx={{
                                  fontSize: '0.65rem',
                                  height: 18,
                                  backgroundColor: alpha(status?.color || theme.palette.grey[400], 0.2),
                                  color: status?.color || theme.palette.grey[600],
                                  '& .MuiChip-label': { px: 0.5 },
                                }}
                              />
                            );
                          })}
                          {tasksForDay.length > 2 && (
                            <Typography variant="caption" color="text.secondary">
                              +{tasksForDay.length - 2} more
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Tasks Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {tasksForSelectedDate.length > 0 ? (
            <List disablePadding>
              {tasksForSelectedDate.map((task, index) => {
                const status = getStatusById(task.statusId);
                return (
                  <React.Fragment key={task.id}>
                    {index > 0 && <Divider />}
                    <ListItem sx={{ py: 1.5 }}>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip
                              size="small"
                              label={status?.name || 'Unknown'}
                              sx={{
                                backgroundColor: alpha(status?.color || theme.palette.grey[400], 0.15),
                                color: status?.color || theme.palette.grey[600],
                              }}
                            />
                            <Chip
                              size="small"
                              label={task.priority}
                              color={task.priority === 'critical' ? 'error' : task.priority === 'high' ? 'warning' : 'default'}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          ) : (
            <Typography color="text.secondary">
              No tasks scheduled for this date
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
