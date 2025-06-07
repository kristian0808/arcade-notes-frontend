import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MembersPage from './pages/MembersPage';
import NotesHistory from './pages/NotesHistory';
import LoginPage from './pages/LoginPage';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, isRefreshing } = useAuth();
  
  console.log('ProtectedRoute - Auth state:', { isAuthenticated, isLoading, isRefreshing });

  // Show loading spinner during initial auth check
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  // Show loading spinner during token refresh
  if (isRefreshing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner />
        <span style={{ marginLeft: '10px' }}>Refreshing session...</span>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const { isAuthenticated, isLoading, isRefreshing } = useAuth();

  // Show loading spinner for the entire app during initial auth check
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  // Show loading spinner during token refresh
  if (isRefreshing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner />
        <span style={{ marginLeft: '10px' }}>Refreshing session...</span>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public route for login */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} 
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/notes" element={<NotesHistory />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;