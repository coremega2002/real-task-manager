import { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import { lightTheme, darkTheme, purpleTheme } from './theme/theme';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { MainLayout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';

import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage';
import TasksPage from './pages/TasksPage';
import TagsPage from './pages/TagsPage';
import StatusesPage from './pages/StatusesPage';
import CalendarPage from './pages/CalendarPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppContent() {
  const { state } = useApp();

  const theme = useMemo(() => {
    switch (state.theme) {
      case 'dark':
        return darkTheme;
      case 'purple':
        return purpleTheme;
      default:
        return lightTheme;
    }
  }, [state.theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/board" replace />} />
                  <Route path="/board" element={<BoardPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/tags" element={<TagsPage />} />
                  <Route path="/statuses" element={<StatusesPage />} />
                  <Route path="/archive" element={<Navigate to="/tasks" replace />} />
                  <Route path="/settings" element={<Navigate to="/board" replace />} />
                  <Route path="*" element={<Navigate to="/board" replace />} />
                </Routes>
              </MainLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <SnackbarProvider maxSnack={3} autoHideDuration={4000}>
          <AppContent />
        </SnackbarProvider>
      </Router>
    </ErrorBoundary>
  );
}
