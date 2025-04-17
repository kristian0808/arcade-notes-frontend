// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // <<<<< MAKE SURE THIS LINE IS PRESENT
import App from './App.tsx';
import { WebSocketProvider } from './contexts/WebSocketContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </StrictMode>,
);