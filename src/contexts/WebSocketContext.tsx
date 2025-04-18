import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { Pc } from '../types/Pc';
import { Member } from '../types/Member';

interface WebSocketContextType {
  isConnected: boolean;
  pcs: Pc[] | null;
  members: Member[] | null;
  error: string | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  pcs: null,
  members: null,
  error: null
});

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [pcs, setPcs] = useState<Pc[] | null>(null);
  const [members, setMembers] = useState<Member[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create socket connection
    const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Socket event handlers
    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setError(null);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log(`WebSocket disconnected: ${reason}`);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
      setError('Failed to connect to server. Retrying...');
    });

    // Listen for PC updates
    socketInstance.on('pcs_update', (updatedPcs: Pc[]) => {
      console.log('Received PC updates via WebSocket');
      setPcs(updatedPcs);
    });

    // Listen for member updates
    socketInstance.on('members_update', (updatedMembers: Member[]) => {
      console.log('Received member updates via WebSocket');
      setMembers(updatedMembers);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        console.log('Cleaning up WebSocket connection');
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, pcs, members, error }}>
      {children}
    </WebSocketContext.Provider>
  );
};