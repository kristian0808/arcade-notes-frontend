import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MembersPage from './pages/MembersPage';
import NotesHistory from './pages/NotesHistory';
import './App.css';

// Import common components styles
import './components/common/common.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/notes" element={<NotesHistory />} />
      </Routes>
    </Router>
  );
};

export default App;
