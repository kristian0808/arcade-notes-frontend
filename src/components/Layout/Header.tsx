import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Layout.css';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNav = (path: string) => {
    navigate(path);
    setMenuOpen(false); // Close menu on navigation
  };

  return (
    <header className="app-header">
      <div className="header-logo">
        <h1>iCafe Notes</h1>
      </div>
      
      <button className={`menu-toggle ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <button
              onClick={() => handleNav('/')}
              className={isActive('/') ? 'active' : ''}
            >Dashboard</button>
          </li>
          <li>
            <button
              onClick={() => handleNav('/members')}
              className={isActive('/members') ? 'active' : ''}
            >Members</button>
          </li>
          <li>
            <button
              onClick={() => handleNav('/notes')}
              className={isActive('/notes') ? 'active' : ''}
            >Notes History</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
