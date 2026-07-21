import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  alpha,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  GetApp as GetIcon,
  CloudUpload as PostIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import logo from '../../logo.svg';

interface TopBarProps {
  title: string;
  onAddClick?: () => void;
  showAddButton?: boolean;
}

export default function TopBar({ title, onAddClick, showAddButton = true }: TopBarProps) {
  const theme = useTheme();
  const { state, dispatch } = useApp();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [searchMethod, setSearchMethod] = useState<'GET' | 'POST'>('GET');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: event.target.value });
  };

  const handleClearSearch = () => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
  };

  return (
    <AppBar 
      position="static"
      sx={{
        boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.1)}`,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' }, px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Logo - Only on larger screens */}
        {!isTablet && (
          <img src={logo} alt="Logo" style={{ width: 40, marginRight: 10 }} />
        )}
        
        {/* Title */}
        <Typography 
          variant="h6" 
          noWrap
          sx={{
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 600,
            flexGrow: { xs: 1, sm: 0 },
          }}
        >
          {title}
        </Typography>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />

        {/* Search Bar - Hide on mobile */}
        {!isMobile && (
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
              marginRight: 2,
              marginLeft: 0,
              width: { sm: 'auto', md: '300px' },
            }}
          >
            <Box
              sx={{
                padding: theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Search tasks..."
              value={state.searchQuery}
              onChange={handleSearchChange}
              sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: theme.spacing(1, 1, 1, 0),
                  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                  transition: theme.transitions.create('width'),
                  fontSize: { sm: '0.875rem', md: '1rem' },
                },
              }}
            />
            {state.searchQuery && (
              <IconButton
                size="small"
                onClick={handleClearSearch}
                sx={{
                  position: 'absolute',
                  right: 4,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'inherit',
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}

        {/* Add Button */}
        {showAddButton && onAddClick && (
          isMobile ? (
            <IconButton
              color="inherit"
              onClick={onAddClick}
              sx={{
                ml: 1,
                backgroundColor: alpha(theme.palette.common.white, 0.15),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.25),
                },
              }}
            >
              <AddIcon />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddClick}
              sx={{
                ml: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                fontWeight: 600,
                fontSize: { sm: '0.8rem', md: '0.9rem' },
                px: { sm: 2, md: 3 },
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                },
              }}
            >
              {!isTablet && 'Add Task'}
            </Button>
          )
        )}

        {/* Notifications - Hide icon on mobile */}
        {!isMobile && (
          <Tooltip title="Notifications">
            <IconButton color="inherit" sx={{ ml: 1 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
}
