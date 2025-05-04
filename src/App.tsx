// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MembersPage from './pages/MembersPage';
import NotesHistory from './pages/NotesHistory';
import LoginPage from './pages/LoginPage'; // Import LoginPage
import { useAuth } from './contexts/AuthContext'; // Import useAuth
import LoadingSpinner from './components/common/LoadingSpinner'; // Assuming a loading spinner component exists

// Protected Route Component
const ProtectedRoute: React.FC = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    // Show loading indicator while checking auth status
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><LoadingSpinner /></div>;
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};


const App: React.FC = () => {
  const { token, isLoading } = useAuth(); // Get auth state here as well for conditional rendering of login

  // Optional: Show loading spinner for the entire app during initial auth check
  if (isLoading) {
     return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><LoadingSpinner /></div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public route for login */}
        <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" replace />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/notes" element={<NotesHistory />} />
          {/* Add other protected routes here */}
        </Route>

        {/* Optional: Catch-all route for 404 */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;