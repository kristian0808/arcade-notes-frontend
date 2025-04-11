// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MembersPage from './pages/MembersPage';
import NotesHistory from './pages/NotesHistory';
// No need to import App.css anymore

const App: React.FC = () => {
  return (
    <Router>
      {/* Layout component will be implicitly applied by pages */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/notes" element={<NotesHistory />} />
        {/* Add other routes here if needed */}
      </Routes>
    </Router>
  );
};

export default App;