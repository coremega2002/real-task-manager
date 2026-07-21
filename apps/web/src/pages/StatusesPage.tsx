import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { TopBar } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { Status } from '../types';

const PRESET_COLORS = [
  '#6B7280', '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
  '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
];

export default function StatusesPage() {
  const theme = useTheme();
  const { state, addStatus, updateStatus, deleteStatus } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [isDefault, setIsDefault] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuStatus, setMenuStatus] = useState<Status | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const sortedStatuses = [...state.statuses].sort((a, b) => a.order - b.order);

  const handleOpenDialog = (status?: Status) => {
    if (status) {
      setEditingStatus(status);
      setName(status.name);
      setColor(status.color);
      setIsDefault(status.isDefault || false);
    } else {
      setEditingStatus(null);
      setName('');
      setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
      setIsDefault(false);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingStatus(null);
    setName('');
    setColor(PRESET_COLORS[0]);
    setIsDefault(false);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (editingStatus) {
      // If setting as default, remove default from other statuses
      if (isDefault && !editingStatus.isDefault) {
        state.statuses.forEach(s => {
          if (s.isDefault && s.id !== editingStatus.id) {
            updateStatus({ ...s, isDefault: false });
          }
        });
      }
      updateStatus({ ...editingStatus, name: name.trim(), color, isDefault });
    } else {
      // If setting as default, remove default from other statuses
      if (isDefault) {
        state.statuses.forEach(s => {
          if (s.isDefault) {
            updateStatus({ ...s, isDefault: false });
          }
        });
      }
      addStatus({ name: name.trim(), color, isDefault });
    }
    handleCloseDialog();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, status: Status) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setMenuStatus(status);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuStatus(null);
  };

  const handleEditClick = () => {
    if (menuStatus) {
      handleOpenDialog(menuStatus);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = () => {
    if (menuStatus) {
      deleteStatus(menuStatus.id);
    }
    setDeleteDialogOpen(false);
    setMenuStatus(null);
  };

  const getStatusTaskCount = (statusId: string) => {
    return state.tasks.filter(t => t.statusId === statusId && !t.archived).length;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar
        title="Statuses"
        showAddButton={false}
      />

      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Manage Statuses
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customize your task workflow statuses
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }}
          >
            Add Status
          </Button>
        </Box>

        {/* Statuses List */}
        <Card sx={{ maxWidth: 600 }}>
          <List disablePadding>
            {sortedStatuses.map((status) => {
              const taskCount = getStatusTaskCount(status.id);
              return (
                <ListItem
                  key={status.id}
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: status.color || PRESET_COLORS[0],
                      mr: 2,
                      boxShadow: `0 0 0 3px ${alpha(status.color || PRESET_COLORS[0], 0.2)}`,
                    }}
                  />
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography fontWeight={500}>{status.name}</Typography>
                        {status.isDefault && (
                          <Typography
                            variant="caption"
                            sx={{
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              fontWeight: 600,
                            }}
                          >
                            Default
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={`${taskCount} task${taskCount !== 1 ? 's' : ''}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, status)}
                    >
                      <MoreIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Card>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleDeleteClick}
          sx={{ color: 'error.main' }}
          disabled={state.statuses.length <= 1}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Status Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>
          {editingStatus ? 'Edit Status' : 'Create New Status'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Status Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
            sx={{ mt: 1, mb: 3 }}
          />
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Color
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {PRESET_COLORS.map((presetColor) => (
              <Box
                key={presetColor}
                onClick={() => setColor(presetColor)}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  backgroundColor: presetColor,
                  cursor: 'pointer',
                  border: color === presetColor ? '3px solid' : '2px solid transparent',
                  borderColor: color === presetColor ? theme.palette.text.primary : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
            ))}
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
            }
            label="Set as default status for new tasks"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!name.trim()}
          >
            {editingStatus ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Status</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the status "{menuStatus?.name}"?
            Tasks with this status will be moved to the default status.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
