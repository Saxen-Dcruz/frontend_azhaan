import React, { createContext, useContext, useReducer, useEffect } from 'react';

const StreamContext = createContext();

const streamReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STREAMS':
      return { ...state, streams: action.payload, loading: false };
    case 'ADD_STREAM':
      return { ...state, streams: [...state.streams, action.payload] };
    case 'UPDATE_STREAM':
      return {
        ...state,
        streams: state.streams.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload } : s
        )
      };
    case 'DELETE_STREAM':
      return {
        ...state,
        streams: state.streams.filter(s => s.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_FILTER':
      return { ...state, currentFilter: action.payload };
    default:
      return state;
  }
};

const initialState = {
  streams: [],
  loading: true,
  currentFilter: 'all'
};

// Mock streams data
const mockStreams = [
  {
    id: 1,
    title: 'Morning Meditation Session',
    description: 'Start your day with peaceful meditation and mindfulness practices.',
    speaker: 'Sarah Wilson',
    speakerId: 101,
    status: 'live',
    listeners: 142,
    maxListeners: 500,
    scheduledTime: new Date(),
    duration: '45 min',
    category: 'Wellness',
    tags: ['meditation', 'wellness', 'mindfulness'],
    isFeatured: true
  },
  {
    id: 2,
    title: 'Tech Talk: Future of WebRTC',
    description: 'Exploring the latest developments in real-time communication technology.',
    speaker: 'Mike Chen',
    speakerId: 102,
    status: 'upcoming',
    listeners: 0,
    maxListeners: 1000,
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    duration: '1 hour',
    category: 'Technology',
    tags: ['webrtc', 'technology', 'programming'],
    isFeatured: true
  },
  {
    id: 3,
    title: 'Jazz Classics Live Performance',
    description: 'Enjoy an evening of smooth jazz classics and improvisation.',
    speaker: 'Alex Rivera',
    speakerId: 103,
    status: 'finished',
    listeners: 89,
    maxListeners: 300,
    scheduledTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    duration: '2 hours',
    category: 'Music',
    tags: ['jazz', 'music', 'live'],
    isFeatured: false
  },
  {
    id: 4,
    title: 'Business Strategy Workshop',
    description: 'Learn effective business strategies for startup growth and scaling.',
    speaker: 'Emma Davis',
    speakerId: 104,
    status: 'upcoming',
    listeners: 0,
    maxListeners: 200,
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    duration: '1.5 hours',
    category: 'Business',
    tags: ['business', 'strategy', 'startup'],
    isFeatured: false
  }
];

export const StreamProvider = ({ children }) => {
  const [state, dispatch] = useReducer(streamReducer, initialState);

  useEffect(() => {
    const loadStreams = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      dispatch({ type: 'SET_STREAMS', payload: mockStreams });
    };

    loadStreams();

    // Simulate real-time updates for live streams
    const interval = setInterval(() => {
      if (state.streams.length > 0) {
        const updatedStreams = state.streams.map(stream => {
          if (stream.status === 'live') {
            return {
              ...stream,
              listeners: stream.listeners + Math.floor(Math.random() * 3) - 1
            };
          }
          return stream;
        });
        dispatch({ type: 'SET_STREAMS', payload: updatedStreams });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const addStream = (stream) => {
    const newStream = {
      ...stream,
      id: Math.max(...state.streams.map(s => s.id)) + 1,
      listeners: 0,
      status: 'upcoming'
    };
    dispatch({ type: 'ADD_STREAM', payload: newStream });
    return newStream;
  };

  const updateStream = (streamId, updates) => {
    dispatch({ type: 'UPDATE_STREAM', payload: { id: streamId, ...updates } });
  };

  const deleteStream = (streamId) => {
    dispatch({ type: 'DELETE_STREAM', payload: streamId });
  };

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const getFilteredStreams = () => {
    if (state.currentFilter === 'all') return state.streams;
    return state.streams.filter(stream => stream.status === state.currentFilter);
  };

  return (
    <StreamContext.Provider value={{
      streams: state.streams,
      filteredStreams: getFilteredStreams(),
      loading: state.loading,
      currentFilter: state.currentFilter,
      addStream,
      updateStream,
      deleteStream,
      setFilter
    }}>
      {children}
    </StreamContext.Provider>
  );
};

export const useStreams = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStreams must be used within StreamProvider');
  }
  return context;
};