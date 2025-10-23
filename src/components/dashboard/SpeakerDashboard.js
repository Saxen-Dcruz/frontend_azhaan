// src/components/dashboard/SpeakerDashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { StreamProvider } from '../../contexts/StreamContext';
import Sidebar from './Sidebar';
import StreamList from '../streams/StreamList';
import { Sparkles, BarChart3, Users, Mic, Calendar, Award, TrendingUp } from 'lucide-react';

const SpeakerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('my-streams');

  const speakerStats = [
    { label: 'Total Streams', value: '45', change: '+3%', icon: Mic, color: 'blue' },
    { label: 'Avg. Listeners', value: '89', change: '+12%', icon: Users, color: 'green' },
    { label: 'Total Earnings', value: '$2,345', change: '+15%', icon: Award, color: 'purple' },
    { label: 'Scheduled', value: '5', change: '+2', icon: Calendar, color: 'orange' }
  ];

  const myStreams = [
    { id: 1, title: 'Morning Meditation', status: 'live', listeners: 45, time: '2h 15m' },
    { id: 2, title: 'Tech Talk Weekly', status: 'upcoming', scheduled: 'Tomorrow, 2:00 PM', listeners: 0 },
    { id: 3, title: 'Music Session #45', status: 'finished', listeners: 128, duration: '1h 30m' }
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
                <h1 className="text-2xl font-bold text-white">Speaker Dashboard</h1>
                <p className="text-gray-400">Manage your streams and engage with listeners</p>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => navigate('/broadcast')}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Quick Broadcast
                </button>
                <button 
                  onClick={() => navigate('/studio')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Advanced Studio</span>
                </button>
              </div>
            </div>

            {/* Speaker Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              {speakerStats.map((stat, index) => (
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
                { id: 'my-streams', label: 'My Streams' },
                { id: 'live', label: 'Live' },
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'finished', label: 'Finished' },
                { id: 'analytics', label: 'Analytics' }
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
            {activeFilter === 'my-streams' && (
              <div className="space-y-6">
                {/* Quick Stream Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {myStreams.map(stream => (
                    <div key={stream.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">{stream.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          stream.status === 'live' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          stream.status === 'upcoming' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        }`}>
                          {stream.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {stream.status === 'live' && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Listeners</span>
                              <span className="text-white">{stream.listeners}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Duration</span>
                              <span className="text-white">{stream.time}</span>
                            </div>
                          </>
                        )}
                        
                        {stream.status === 'upcoming' && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Scheduled</span>
                            <span className="text-white">{stream.scheduled}</span>
                          </div>
                        )}
                        
                        {stream.status === 'finished' && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Peak Listeners</span>
                              <span className="text-white">{stream.listeners}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Duration</span>
                              <span className="text-white">{stream.duration}</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        {stream.status === 'live' && (
                          <button className="flex-1 bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700">
                            End Stream
                          </button>
                        )}
                        {stream.status === 'upcoming' && (
                          <button className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">
                            Edit Schedule
                          </button>
                        )}
                        <button className="flex-1 bg-gray-600 text-white py-2 rounded text-sm hover:bg-gray-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analytics Preview */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Performance Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-gray-300 mb-3">Listener Growth</h4>
                      {/* Placeholder for chart */}
                      <div className="h-32 bg-gray-750 rounded flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-green-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-gray-300 mb-3">Stream Performance</h4>
                      {/* Placeholder for chart */}
                      <div className="h-32 bg-gray-750 rounded flex items-center justify-center">
                        <BarChart3 className="h-8 w-8 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Show StreamList for other filters */}
            {activeFilter !== 'my-streams' && activeFilter !== 'analytics' && (
              <StreamList filter={activeFilter} />
            )}
          </main>
        </div>
      </div>
    </StreamProvider>
  );
};

export default SpeakerDashboard;