import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as authApi from '../api/authApi';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isRefreshing: boolean; // New prop to track token refresh state
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // Track token refresh state
  const [error, setError] = useState<string | null>(null);

  // Listen for token refresh events from the apiClient
  useEffect(() => {
    const tokenRefreshHandler = (event: CustomEvent) => {
      setIsRefreshing(event.detail);
    };

    const logoutHandler = () => {
      console.log('AuthContext - Logout event triggered');
      setIsAuthenticated(false);
    };

    // Add event listeners
    window.addEventListener('token:refreshing', tokenRefreshHandler as EventListener);
    window.addEventListener('auth:logout', logoutHandler);

    return () => {
      // Clean up event listeners
      window.removeEventListener('token:refreshing', tokenRefreshHandler as EventListener);
      window.removeEventListener('auth:logout', logoutHandler);
    };
  }, []);

  useEffect(() => {
    // Only check auth status once on mount
    let mounted = true;
    
    const checkAuth = async () => {
      try {
        await authApi.getProfile();
        if (mounted) {
          setIsAuthenticated(true);
        }
      } catch {
        if (mounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    checkAuth();
    
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - run only once on mount

  const login = async (username: string, password: string) => {
    setError(null);
    try {
      await authApi.login(username, password);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout failed:', err);
      // Force logout even if API call fails
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      isLoading, 
      isRefreshing, // Expose the refreshing state
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};