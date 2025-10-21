// src/contexts/SocketContext.js
import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [listenerCounts, setListenerCounts] = useState({});

  // Effect to handle authentication changes
  useEffect(() => {
    if (isAuthenticated && user) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user]);

  const connectSocket = () => {
    try {
      // Create WebSocket connection to your backend
      socketRef.current = new WebSocket('ws://localhost:8000/ws');
      
      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        
        // Authenticate with the server
        if (user) {
          socketRef.current.send(JSON.stringify({
            type: 'authenticate',
            user_id: user.id,
            token: user.token
          }));
        }
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setIsConnected(false);
    }
  };

  const handleSocketMessage = (data) => {
    switch (data.type) {
      case 'listener_count_update':
        setListenerCounts(prev => ({
          ...prev,
          [data.stream_id]: data.count
        }));
        break;
        
      case 'stream_started':
        // Handle new stream started
        console.log('Stream started:', data.stream);
        break;
        
      case 'stream_ended':
        // Handle stream ended
        console.log('Stream ended:', data.stream_id);
        setListenerCounts(prev => {
          const newCounts = { ...prev };
          delete newCounts[data.stream_id];
          return newCounts;
        });
        break;
        
      case 'webrtc_offer':
        // Forward to specific component via callback
        if (data.callback) {
          data.callback(data);
        }
        break;
        
      case 'webrtc_ice_candidate':
        // Forward to specific component via callback
        if (data.callback) {
          data.callback(data);
        }
        break;
        
      case 'error':
        console.error('WebSocket error:', data.message);
        break;
        
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      return true;
    } else {
      console.error('WebSocket not connected');
      return false;
    }
  };

  // Start a new broadcast
  const startBroadcast = (streamData) => {
    return sendMessage({
      type: 'start_broadcast',
      ...streamData,
      user_id: user.id
    });
  };

  // Stop a broadcast
  const stopBroadcast = (streamId) => {
    return sendMessage({
      type: 'stop_broadcast',
      stream_id: streamId,
      user_id: user.id
    });
  };

  // Join a stream as listener
  const joinStream = (streamId, callbacks = {}) => {
    return sendMessage({
      type: 'join_stream',
      stream_id: streamId,
      user_id: user.id,
      callbacks: callbacks // Store callbacks for WebRTC events
    });
  };

  // Leave a stream
  const leaveStream = (streamId) => {
    return sendMessage({
      type: 'leave_stream',
      stream_id: streamId,
      user_id: user.id
    });
  };

  // Send WebRTC answer
  const sendWebRTCAnswer = (streamId, answer) => {
    return sendMessage({
      type: 'webrtc_answer',
      stream_id: streamId,
      answer: answer,
      user_id: user.id
    });
  };

  // Send ICE candidate
  const sendICECandidate = (streamId, candidate) => {
    return sendMessage({
      type: 'webrtc_ice_candidate',
      stream_id: streamId,
      candidate: candidate,
      user_id: user.id
    });
  };

  // Get current listener count for a stream
  const getListenerCount = (streamId) => {
    return listenerCounts[streamId] || 0;
  };

  const value = {
    isConnected,
    listenerCounts,
    
    // Core methods
    sendMessage,
    startBroadcast,
    stopBroadcast,
    joinStream,
    leaveStream,
    
    // WebRTC methods
    sendWebRTCAnswer,
    sendICECandidate,
    
    // Utility methods
    getListenerCount
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};