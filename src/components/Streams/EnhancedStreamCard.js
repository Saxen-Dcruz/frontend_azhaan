// src/components/streams/EnhancedStreamCard.js
import React, { useState } from 'react';
import { Play, Users, Clock, Heart, Share2, Wifi, Volume2 } from 'lucide-react';

const EnhancedStreamCard = ({ stream, onJoin }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1";
    
    switch (status) {
      case 'live':
        return `${baseClasses} bg-red-500/20 text-red-300 border border-red-500/30`;
      case 'upcoming':
        return `${baseClasses} bg-blue-500/20 text-blue-300 border border-blue-500/30`;
      case 'finished':
        return `${baseClasses} bg-gray-500/20 text-gray-300 border border-gray-500/30`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-300`;
    }
  };

  const formatListeners = (count) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <div 
      className="bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with status and metrics */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className={getStatusBadge(stream.status)}>
            {stream.status === 'live' && (
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            )}
            <span className="capitalize">{stream.status}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Users className="h-4 w-4" />
            <span>{formatListeners(stream.listeners)}</span>
          </div>
        </div>

        {/* Stream title and description */}
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 leading-tight">
          {stream.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {stream.description}
        </p>

        {/* Stream metrics */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{stream.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Wifi className="h-4 w-4 text-green-400" />
              <span>HD</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-semibold text-white">{stream.speaker}</div>
            <div className="text-xs text-gray-400">
              {new Date(stream.scheduledTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        {/* Tags */}
        {stream.tags && stream.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {stream.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded-lg border border-gray-600/50"
              >
                #{tag}
              </span>
            ))}
            {stream.tags.length > 3 && (
              <span className="inline-block bg-gray-700/50 text-gray-400 text-xs px-2 py-1 rounded-lg">
                +{stream.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="bg-gray-750/50 px-6 py-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
              <Heart className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-500/10">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={onJoin}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              stream.status === 'live'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {stream.status === 'live' && <Volume2 className="h-4 w-4" />}
            <span>
              {stream.status === 'live' && 'Join Stream'}
              {stream.status === 'upcoming' && 'Set Reminder'}
              {stream.status === 'finished' && 'View Recording'}
            </span>
          </button>
        </div>
      </div>

      {/* Hover overlay */}
      {isHovered && stream.status === 'live' && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl flex items-end justify-center p-6 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="text-white text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Live Now</span>
            </div>
            <p className="text-sm text-gray-300">Click to join the conversation</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedStreamCard;