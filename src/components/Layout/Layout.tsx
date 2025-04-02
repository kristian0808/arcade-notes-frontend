import React from 'react';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} iCafe Notes Management</p>
      </footer>
    </div>
  );
};

export default Layout;