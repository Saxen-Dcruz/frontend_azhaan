// src/contexts/LiveKitContext.js
import React, { createContext, useContext, useState, useRef } from 'react';
import { Room } from 'livekit-client';

const LiveKitContext = createContext();

export const LiveKitProvider = ({ children }) => {
  const [room, setRoom] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const roomRef = useRef(null);

  const connectToRoom = async (roomName, token) => {
    try {
      const newRoom = new Room();
      await newRoom.connect(process.env.REACT_APP_LIVEKIT_URL, token);
      
      roomRef.current = newRoom;
      setRoom(newRoom);
      setIsConnected(true);
      
      return newRoom;
    } catch (error) {
      console.error('Failed to connect to room:', error);
      throw error;
    }
  };

  const disconnectFromRoom = async () => {
    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
      setRoom(null);
      setIsConnected(false);
    }
  };

  const value = {
    room: roomRef.current,
    isConnected,
    connectToRoom,
    disconnectFromRoom
  };

  return (
    <LiveKitContext.Provider value={value}>
      {children}
    </LiveKitContext.Provider>
  );
};

export const useLiveKit = () => {
  const context = useContext(LiveKitContext);
  if (!context) {
    throw new Error('useLiveKit must be used within LiveKitProvider');
  }
  return context;
};