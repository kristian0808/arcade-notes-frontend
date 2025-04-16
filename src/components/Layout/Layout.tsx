// src/components/Layout/Layout.tsx
import React, { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Monitor, User, FileText, Settings, Bell, Search, Menu, ShoppingCart, Package } from 'lucide-react'; // Add icons you need

interface LayoutProps {
  children: ReactNode;
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  to: string;
  active: boolean;
  collapsed: boolean;
}

// SidebarItem Helper Component
const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, to, active, collapsed }) => {
  return (
    <Link
      to={to}
      className={`flex items-center w-full px-4 py-3 transition-colors duration-200 ${
        active
          ? 'bg-indigo-800 text-white' // Active state style
          : 'text-indigo-100 hover:bg-indigo-700 hover:text-white' // Inactive state style
      }`}
      title={collapsed ? text : ''} // Show tooltip when collapsed
    >
      <div className={`flex-shrink-0 ${!collapsed ? 'mr-3' : 'mx-auto'}`}>
        {icon}
      </div>
      {!collapsed && <span className="whitespace-nowrap">{text}</span>}
    </Link>
  );
};

// Main Layout Component
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const isActive = (path: string) => location.pathname === path;

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
          {/* Add other potential navigation items here */}
          {/*
          <SidebarItem
            icon={<ShoppingCart size={20}/>}
            text="Orders"
            to="/orders"
            active={isActive('/orders')}
            collapsed={sidebarCollapsed}
           />
           <SidebarItem
            icon={<Package size={20}/>}
            text="Products"
            to="/products"
            active={isActive('/products')}
            collapsed={sidebarCollapsed}
           />
           <SidebarItem
            icon={<Settings size={20}/>}
            text="Settings"
            to="/settings"
            active={isActive('/settings')}
            collapsed={sidebarCollapsed}
           />
           */}
        </nav>
        {/* Optional: Add something to the bottom of the sidebar */}
        {/* <div className="p-4 mt-auto border-t border-indigo-800"> ... </div> */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar (Optional) */}
        <header className="bg-white shadow-sm z-10 h-16 flex-shrink-0">
          <div className="flex items-center justify-end p-4 h-full"> {/* Adjust content (e.g., search, user menu) */}
            {/* Placeholder for Top Nav Content (e.g., global search, user dropdown) */}
             {/* Example User Icon */}
             {/* <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                   <User size={16} className="text-gray-600"/>
                 </div>
                 <span className="text-sm font-medium">Admin</span>
            </div> */}
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