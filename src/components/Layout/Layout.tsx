// src/components/Layout/Layout.tsx
import React, { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Monitor, User, FileText, Settings, Bell, Search, Menu, ShoppingCart, Package, LogOut } from 'lucide-react'; // Add LogOut icon
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth

interface LayoutProps {
  children: ReactNode;
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  to?: string; // Make 'to' optional for onClick items
  active: boolean;
  collapsed: boolean;
  onClick?: () => void; // Add optional onClick handler
}

// SidebarItem Helper Component - Updated to handle onClick
const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, to, active, collapsed, onClick }) => {
  const content = (
    <>
      <div className={`flex-shrink-0 ${!collapsed ? 'mr-3' : 'mx-auto'}`}>
        {icon}
      </div>
      {!collapsed && <span className="whitespace-nowrap">{text}</span>}
    </>
  );

  const className = `flex items-center w-full px-4 py-3 transition-colors duration-200 ${
    active
      ? 'bg-indigo-800 text-white'
      : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
  }`;

  if (to) {
    return (
      <Link
        to={to}
        className={className}
        title={collapsed ? text : ''}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={className}
      title={collapsed ? text : ''}
      type="button"
    >
      {content}
    </button>
  );
};

// Main Layout Component
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get logout function from auth context

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Sidebar */}
      <div className={`flex flex-col bg-indigo-900 text-white transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-indigo-800 flex-shrink-0">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold whitespace-nowrap">iCafe Notes</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded text-indigo-200 hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-grow">
          <SidebarItem
            icon={<Monitor size={20}/>}
            text="Dashboard"
            to="/"
            active={isActive('/')}
            collapsed={sidebarCollapsed}
          />
          <SidebarItem
            icon={<User size={20}/>}
            text="Members"
            to="/members"
            active={isActive('/members')}
            collapsed={sidebarCollapsed}
          />
          <SidebarItem
            icon={<FileText size={20}/>}
            text="Notes History"
            to="/notes"
            active={isActive('/notes')}
            collapsed={sidebarCollapsed}
          />
        </nav>

        {/* Logout Button at the bottom */}
        <div className="p-4 mt-auto border-t border-indigo-800">
          <SidebarItem
            icon={<LogOut size={20}/>}
            text="Logout"
            active={false}
            collapsed={sidebarCollapsed}
            onClick={handleLogout}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar (Optional) */}
        <header className="bg-white shadow-sm z-10 h-16 flex-shrink-0">
          <div className="flex items-center justify-end p-4 h-full">
            {/* Placeholder for Top Nav Content */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;