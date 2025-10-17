import React from 'react';
import { Play, Users, Calendar, Clock } from 'lucide-react';

const StreamCard = ({ stream }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 text-white';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'finished':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live':
        return <Play className="h-4 w-4" />;
      case 'upcoming':
        return <Calendar className="h-4 w-4" />;
      case 'finished':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stream.status)}`}>
            {getStatusIcon(stream.status)}
            <span className="capitalize">{stream.status}</span>
          </span>
          {stream.isFeatured && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              Featured
            </span>
          )}
        </div>

        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {stream.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {stream.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{stream.listeners} listeners</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{stream.duration}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-medium text-white">{stream.speaker}</div>
            <div className="text-xs">{formatDate(stream.scheduledTime)}</div>
          </div>
        </div>

        {stream.tags && stream.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {stream.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-750 px-6 py-3 border-t border-gray-700">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
          {stream.status === 'live' && <Play className="h-4 w-4" />}
          <span>
            {stream.status === 'live' && 'Join Stream'}
            {stream.status === 'upcoming' && 'Set Reminder'}
            {stream.status === 'finished' && 'View Recording'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default StreamCard;