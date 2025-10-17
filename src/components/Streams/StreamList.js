import React from 'react';
import { useStreams } from '../../contexts/StreamContext';
import StreamCard from './StreamCard.js';
import LoadingSpinner from '../ui/LoadingSpinner';

const StreamList = ({ filter }) => {
  const { filteredStreams, loading } = useStreams();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (filteredStreams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No streams found</h3>
        <p className="text-gray-400">Check back later for new streams!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStreams.map(stream => (
        <StreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
};

export default StreamList;