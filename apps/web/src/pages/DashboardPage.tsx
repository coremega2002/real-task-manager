import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  Warning as OverdueIcon,
  TrendingUp as TrendingIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { TopBar } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { PRIORITY_CONFIG } from '../types';
import { format, isPast, isToday, addDays, isBefore } from 'date-fns';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
        color: 'white',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                <TrendingIcon fontSize="small" />
                <Typography variant="caption">{trend}</Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              backgroundColor: alpha('#fff', 0.2),
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const theme = useTheme();
  const { state, getFilteredTasks, getStatusById, getTagById } = useApp();

  const tasks = state.tasks.filter(t => !t.archived);
  const completedStatus = state.statuses.find(s => s.name.toLowerCase() === 'done');
  const completedTasks = tasks.filter(t => t.statusId === completedStatus?.id);
  const pendingTasks = tasks.filter(t => t.statusId !== completedStatus?.id);
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.statusId === completedStatus?.id) return false;
    return isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate));
  });

  // Tasks by status
  const tasksByStatus = state.statuses.map(status => ({
    status,
    count: tasks.filter(t => t.statusId === status.id).length,
  }));

  // Tasks by priority
  const tasksByPriority = {
    critical: tasks.filter(t => t.priority === 'critical').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  // Upcoming deadlines
  const upcomingDeadlines = tasks
    .filter(t => {
      if (!t.dueDate || t.statusId === completedStatus?.id) return false;
      const dueDate = new Date(t.dueDate);
      return isBefore(dueDate, addDays(new Date(), 7));
    })
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  // Recent tasks
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const completionRate = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Dashboard" showAddButton={false} />

      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Tasks"
              value={tasks.length}
              icon={<TaskIcon />}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed"
              value={completedTasks.length}
              icon={<CompletedIcon />}
              color={theme.palette.success.main}
              trend={`${completionRate}% completion rate`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="In Progress"
              value={pendingTasks.length}
              icon={<PendingIcon />}
              color={theme.palette.info.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Overdue"
              value={overdueTasks.length}
              icon={<OverdueIcon />}
              color={theme.palette.error.main}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Tasks by Status */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Tasks by Status
                </Typography>
                {tasksByStatus.map(({ status, count }) => (
                  <Box key={status.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: status.color,
                          }}
                        />
                        <Typography variant="body2">{status.name}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {count}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={tasks.length > 0 ? (count / tasks.length) * 100 : 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: alpha(status.color, 0.15),
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: status.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Tasks by Priority */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Tasks by Priority
                </Typography>
                {Object.entries(tasksByPriority).map(([priority, count]) => {
                  const config = PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG];
                  return (
                    <Box key={priority} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FlagIcon sx={{ fontSize: 16, color: config.color }} />
                          <Typography variant="body2">{config.label}</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {count}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={tasks.length > 0 ? (count / tasks.length) * 100 : 0}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha(config.color, 0.15),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: config.color,
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Deadlines */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Upcoming Deadlines
                </Typography>
                {upcomingDeadlines.length > 0 ? (
                  <List disablePadding>
                    {upcomingDeadlines.map((task, index) => {
                      const isOverdue = isPast(new Date(task.dueDate!)) && !isToday(new Date(task.dueDate!));
                      return (
                        <React.Fragment key={task.id}>
                          {index > 0 && <Divider />}
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CalendarIcon
                                sx={{
                                  color: isOverdue ? 'error.main' : isToday(new Date(task.dueDate!)) ? 'warning.main' : 'text.secondary',
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={task.title}
                              secondary={format(new Date(task.dueDate!), 'MMM d, yyyy')}
                              primaryTypographyProps={{
                                noWrap: true,
                                fontWeight: 500,
                              }}
                            />
                            <Chip
                              size="small"
                              label={isOverdue ? 'Overdue' : isToday(new Date(task.dueDate!)) ? 'Today' : 'Upcoming'}
                              color={isOverdue ? 'error' : isToday(new Date(task.dueDate!)) ? 'warning' : 'default'}
                              sx={{ ml: 1 }}
                            />
                          </ListItem>
                        </React.Fragment>
                      );
                    })}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    No upcoming deadlines
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Recent Activity
                </Typography>
                {recentTasks.length > 0 ? (
                  <List disablePadding>
                    {recentTasks.map((task, index) => {
                      const status = getStatusById(task.statusId);
                      return (
                        <React.Fragment key={task.id}>
                          {index > 0 && <Divider />}
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                  backgroundColor: status?.color || theme.palette.grey[400],
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={task.title}
                              secondary={`Updated ${format(new Date(task.updatedAt), 'MMM d, h:mm a')}`}
                              primaryTypographyProps={{
                                noWrap: true,
                                fontWeight: 500,
                              }}
                            />
                            <Chip
                              size="small"
                              label={status?.name || 'Unknown'}
                              sx={{
                                ml: 1,
                                backgroundColor: alpha(status?.color || theme.palette.grey[400], 0.15),
                                color: status?.color || theme.palette.grey[600],
                              }}
                            />
                          </ListItem>
                        </React.Fragment>
                      );
                    })}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    No recent activity
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
