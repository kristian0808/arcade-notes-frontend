import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import apiClient from '../api/apiClient'; // Import apiClient to set auth header

interface AuthContextType {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
  isLoading: boolean; // To handle initial token loading
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading

  // Load token from localStorage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      // Set the token in the apiClient header for subsequent requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setIsLoading(false); // Finished loading token
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    // Set the token in the apiClient header
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    // TODO: Potentially fetch user profile here after login
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
    // Remove the token from the apiClient header
    delete apiClient.defaults.headers.common['Authorization'];
    // TODO: Redirect to login page or clear user state
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
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