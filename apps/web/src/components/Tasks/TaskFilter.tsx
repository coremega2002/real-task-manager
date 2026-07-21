import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  GetApp as GetIcon,
  CloudUpload as PostIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

interface TaskFilterProps {
  onFilter: (search: string, priorities: string[]) => void;
  priorities: string[];
  setPriorities: (priorities: string[]) => void;
}

export default function TaskFilter({ onFilter, priorities, setPriorities }: TaskFilterProps) {
  const theme = useTheme();
  const { state, dispatch } = useApp();
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [searchMethod, setSearchMethod] = useState<'GET' | 'POST'>('GET');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilter(event.target.value, priorities);
  };

  const handleClearSearch = () => {
    onFilter('', priorities);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handlePriorityFilter = (priority: string) => {
    const newPriorities = priorities.includes(priority)
      ? priorities.filter((p) => p !== priority)
      : [...priorities, priority];
    setPriorities(newPriorities);
    onFilter(state.searchQuery, newPriorities);
  };

  const handleSearchMethodChange = (
    event: React.MouseEvent<HTMLElement>,
    newMethod: 'GET' | 'POST' | null,
  ) => {
    if (newMethod !== null) {
      setSearchMethod(newMethod);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      {/* Search Field */}
      <TextField
        placeholder="Search tasks..."
        fullWidth
        size="small"
        value={state.searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: state.searchQuery && (
            <IconButton size="small" onClick={handleClearSearch}>
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />

      {/* Search Method Toggle */}
      <ToggleButtonGroup
        value={searchMethod}
        exclusive
        onChange={handleSearchMethodChange}
        size="small"
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          '& .MuiToggleButton-root': {
            border: 'none',
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
            },
          },
        }}
      >
        <ToggleButton value="GET" aria-label="GET method">
          <GetIcon fontSize="small" sx={{ mr: 0.5 }} />
          GET
        </ToggleButton>
        <ToggleButton value="POST" aria-label="POST method">
          <PostIcon fontSize="small" sx={{ mr: 0.5 }} />
          POST
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Filter Button */}
      <IconButton onClick={handleFilterClick}>
        <FilterIcon />
      </IconButton>

      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={() => handlePriorityFilter('Critical')}>
          <Chip size="small" label="Critical" sx={{ bgcolor: '#EF4444', color: 'white', mr: 1 }} />
        </MenuItem>
        <MenuItem onClick={() => handlePriorityFilter('High')}>
          <Chip size="small" label="High" sx={{ bgcolor: '#F59E0B', color: 'white', mr: 1 }} />
        </MenuItem>
        <MenuItem onClick={() => handlePriorityFilter('Medium')}>
          <Chip size="small" label="Medium" sx={{ bgcolor: '#3B82F6', color: 'white', mr: 1 }} />
        </MenuItem>
        <MenuItem onClick={() => handlePriorityFilter('Low')}>
          <Chip size="small" label="Low" sx={{ bgcolor: '#6B7280', color: 'white', mr: 1 }} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handlePriorityFilter('All')} sx={{ color: 'error.main' }}>
          Clear All
        </MenuItem>
      </Menu>
    </Box>
  );
}
