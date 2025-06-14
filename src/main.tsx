// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // <<<<< MAKE SURE THIS LINE IS PRESENT
import App from './App.tsx';
import { WebSocketProvider } from './contexts/WebSocketContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx'; // Import AuthProvider
import { ThemeProvider } from './contexts/ThemeContext.tsx'; // Import ThemeProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider> {/* Wrap with ThemeProvider */}
      <AuthProvider> {/* Wrap with AuthProvider */}
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);