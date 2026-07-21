import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  Select,
  MenuItem,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ViewKanban as KanbanIcon,
  List as ListIcon,
  LocalOffer as TagIcon,
  Settings as SettingsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Tune as TuneIcon,
  Archive as ArchiveIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import logo from '../../logo.svg';

const DRAWER_WIDTH = 260;

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/board', label: 'Kanban Board', icon: <KanbanIcon /> },
  { path: '/tasks', label: 'Task List', icon: <ListIcon /> },
  { path: '/calendar', label: 'Calendar', icon: <CalendarIcon /> },
];

const managementNavItems: NavItem[] = [
  { path: '/statuses', label: 'Statuses', icon: <TuneIcon /> },
  { path: '/archive', label: 'Archive', icon: <ArchiveIcon /> },
];

const settingsNavItems: NavItem[] = [
  { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { state, setTheme } = useApp();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const handleToggleDarkMode = () => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const handleThemeChange = (event: any) => {
    setTheme(event.target.value);
  };

  const renderNavSection = (items: NavItem[], title?: string) => (
    <>
      {title && (
        <Typography
          variant="overline"
          sx={{
            px: 3,
            py: 1.5,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: '0.08em',
            fontSize: { xs: '0.65rem', sm: '0.75rem' },
          }}
        >
          {title}
        </Typography>
      )}
      <List sx={{ px: 1 }}>
        {items.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                py: { xs: 1, sm: 1.2 },
                '&.Mui-selected': {
                  backgroundColor: `${theme.palette.primary.main}15`,
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}08`,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: { xs: 36, sm: 40 },
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  const drawerContent = (
    <>
      {/* Logo / Brand - Only show on desktop */}
      {!isMobile && (
        <>
          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <img src={logo} alt="Logo" style={{ width: 40, marginRight: 10 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                TaskMaster
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pro Edition
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mx: 2 }} />
        </>
      )}

      {/* Main Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        {renderNavSection(mainNavItems)}
        
        <Divider sx={{ mx: 2, my: 1 }} />
        
        {renderNavSection(managementNavItems, 'Management')}
        
        <Divider sx={{ mx: 2, my: 1 }} />
        
        {renderNavSection(settingsNavItems)}
      </Box>

      {/* Bottom Section */}
      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: { xs: 1, sm: 1.5 },
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255,255,255,0.03)' 
              : 'rgba(0,0,0,0.02)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            <Avatar
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                bgcolor: 'primary.main',
                fontSize: '0.9rem',
              }}
            >
              U
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                User
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                Free Plan
              </Typography>
            </Box>
          </Box>
          <Tooltip title={state.darkMode ? 'Light Mode' : 'Dark Mode'}>
            <IconButton size="small" onClick={handleToggleDarkMode}>
              {state.darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 600, 
              mb: 1, 
              display: 'block',
              fontSize: { xs: '0.7rem', sm: '0.75rem' }
            }}
          >
            Select Theme
          </Typography>
          <Select
            value={state.theme}
            onChange={handleThemeChange}
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              '& .MuiSelect-select': {
                padding: { xs: '6px 10px', sm: '8px 12px' },
                borderRadius: 2,
                backgroundColor: theme.palette.background.default,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                '&:focus': {
                  backgroundColor: theme.palette.background.default,
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <MenuItem value="light">Light Theme</MenuItem>
            <MenuItem value="dark">Dark Theme</MenuItem>
            <MenuItem value="purple">Purple Theme</MenuItem>
          </Select>
        </Box>
      </Box>
    </>
  );

  return (
    <>
      {/* Mobile drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Desktop drawer */
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
