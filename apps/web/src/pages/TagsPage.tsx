import React, { useState } from 'react';
import {
  Box,
  Grid,
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
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  LocalOffer as TagIcon,
} from '@mui/icons-material';
import { TopBar } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { Tag } from '../types';

const PRESET_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#84CC16',
  '#06B6D4', '#A855F7', '#F43F5E', '#22C55E', '#0EA5E9',
];

export default function TagsPage() {
  const theme = useTheme();
  const { state, addTag, updateTag, deleteTag } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuTag, setMenuTag] = useState<Tag | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleOpenDialog = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setName(tag.name);
      setColor(tag.color);
    } else {
      setEditingTag(null);
      setName('');
      setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTag(null);
    setName('');
    setColor(PRESET_COLORS[0]);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (editingTag) {
      updateTag({ ...editingTag, name: name.trim(), color });
    } else {
      addTag({ name: name.trim(), color });
    }
    handleCloseDialog();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, tag: Tag) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setMenuTag(tag);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuTag(null);
  };

  const handleEditClick = () => {
    if (menuTag) {
      handleOpenDialog(menuTag);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = () => {
    if (menuTag) {
      deleteTag(menuTag.id);
    }
    setDeleteDialogOpen(false);
    setMenuTag(null);
  };

  const getTagUsageCount = (tagId: string) => {
    return state.tasks.filter(t => t.tagIds.includes(tagId)).length;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar
        title="Tags"
        showAddButton={false}
      />

      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Manage Tags
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {state.tags.length} tags total
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
            Add Tag
          </Button>
        </Box>

        {/* Tags Grid */}
        <Grid container spacing={2}>
          {state.tags.map((tag) => {
            const usageCount = getTagUsageCount(tag.id);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={tag.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      borderColor: tag.color,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${alpha(tag.color, 0.2)}`,
                    },
                  }}
                  onClick={() => handleOpenDialog(tag)}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: alpha(tag.color, 0.15),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <TagIcon sx={{ color: tag.color }} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {tag.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {usageCount} task{usageCount !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, tag)}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={tag.name}
                        size="small"
                        sx={{
                          backgroundColor: alpha(tag.color, 0.15),
                          color: tag.color,
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

          {/* Add Tag Card */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                cursor: 'pointer',
                border: `2px dashed ${theme.palette.divider}`,
                backgroundColor: 'transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
              onClick={() => handleOpenDialog()}
            >
              <CardContent
                sx={{
                  p: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 120,
                }}
              >
                <AddIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Add New Tag
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Tag Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>
          {editingTag ? 'Edit Tag' : 'Create New Tag'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tag Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
            sx={{ mt: 1, mb: 3 }}
          />
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Color
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Preview
            </Typography>
            <Chip
              label={name || 'Tag Name'}
              sx={{
                backgroundColor: alpha(color, 0.15),
                color: color,
                fontWeight: 500,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!name.trim()}
          >
            {editingTag ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Tag</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the tag "{menuTag?.name}"?
            This will remove the tag from all tasks.
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
