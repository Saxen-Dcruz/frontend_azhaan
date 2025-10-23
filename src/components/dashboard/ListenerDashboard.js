// src/components/dashboard/ListenerDashboard.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StreamProvider } from '../../contexts/StreamContext';
import Sidebar from './Sidebar';
import StreamList from '../streams/StreamList';
import { Headphones, Users, Heart, Clock, TrendingUp, Star } from 'lucide-react';

const ListenerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeFilter, setActiveFilter] = useState('recommended');

  const listenerStats = [
    { label: 'Listening Time', value: '45h', change: '+8%', icon: Headphones, color: 'blue' },
    { label: 'Favorite Speakers', value: '12', change: '+2', icon: Users, color: 'green' },
    { label: 'Streams Joined', value: '67', change: '+15%', icon: TrendingUp, color: 'purple' },
    { label: 'Following', value: '23', change: '+3', icon: Heart, color: 'red' }
  ];

  const favoriteSpeakers = [
    { id: 1, name: 'John Speaker', category: 'Technology', isLive: true },
    { id: 2, name: 'Sarah Musician', category: 'Music', isLive: false },
    { id: 3, name: 'Mike Educator', category: 'Education', isLive: true }
  ];

  return (
    <StreamProvider>
      <div className="flex h-screen bg-gray-900">
        {/* Sidebar */}
        <Sidebar user={user} onLogout={logout} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-gray-800 border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Listener Dashboard</h1>
                <p className="text-gray-400">Discover and enjoy amazing audio streams</p>
              </div>
              
              <div className="flex space-x-3">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Browse Categories
                </button>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  My Favorites
                </button>
              </div>
            </div>

            {/* Listener Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              {listenerStats.map((stat, index) => (
                <div key={index} className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 bg-${stat.color}-600/20 rounded-lg`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-4 mt-6">
              {[
                { id: 'recommended', label: 'Recommended' },
                { id: 'live', label: 'Live Now' },
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'following', label: 'Following' },
                { id: 'favorites', label: 'Favorites' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* Favorite Speakers Section */}
            {activeFilter === 'following' && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Your Favorite Speakers</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {favoriteSpeakers.map(speaker => (
                    <div key={speaker.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {speaker.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{speaker.name}</h3>
                          <p className="text-gray-400 text-sm">{speaker.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {speaker.isLive && (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-red-400 text-sm">Live</span>
                            </div>
                          )}
                          <button className="text-gray-400 hover:text-red-400 transition-colors">
                            <Heart className="h-4 w-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Listening History for Favorites tab */}
            {activeFilter === 'favorites' && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Recently Listened</h2>
                <div className="space-y-3">
                  {[
                    { id: 1, title: 'Morning Jazz Session', speaker: 'Sarah Musician', duration: '2h 15m', time: 'Yesterday' },
                    { id: 2, title: 'Tech News Daily', speaker: 'John Speaker', duration: '45m', time: '2 days ago' },
                    { id: 3, title: 'Learn Spanish Basics', speaker: 'Mike Educator', duration: '1h 30m', time: '1 week ago' }
                  ].map(stream => (
                    <div key={stream.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
                          <Headphones className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{stream.title}</h3>
                          <p className="text-gray-400 text-sm">by {stream.speaker}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{stream.duration}</span>
                        </div>
                        <span className="text-sm">{stream.time}</span>
                        <button className="text-blue-400 hover:text-blue-300">
                          <Star className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stream List */}
            <StreamList filter={activeFilter} />
          </main>
        </div>
      </div>
    </StreamProvider>
  );
};

export default ListenerDashboard;