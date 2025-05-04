// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // <<<<< MAKE SURE THIS LINE IS PRESENT
import App from './App.tsx';
import { WebSocketProvider } from './contexts/WebSocketContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx'; // Import AuthProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider> {/* Wrap with AuthProvider */}
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </AuthProvider>
  </StrictMode>,
);