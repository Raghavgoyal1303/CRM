import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    if (token && user) {
      const newSocket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('[Socket] Connected to server');
      });

      newSocket.on('NEW_INBOUND_CALL', (data) => {
        console.log('[Socket] Incoming call received:', data);
        setIncomingCall(data);
        
        // Auto-clear notification after 30 seconds if not answered
        setTimeout(() => setIncomingCall(null), 30000);
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [token, user]);

  const clearCall = () => setIncomingCall(null);

  return (
    <SocketContext.Provider value={{ socket, incomingCall, clearCall }}>
      {children}
    </SocketContext.Provider>
  );
};
