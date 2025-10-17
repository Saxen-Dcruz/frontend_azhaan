import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import StreamList from '../Streams/StreamList';
import { StreamProvider } from '../../contexts/StreamContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <StreamProvider>
      <div className="flex h-screen bg-gray-900">
        {/* Sidebar */}
        <Sidebar 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          user={user}
          onLogout={logout}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with Filter Tabs */}
          <header className="bg-gray-800 border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  All Streams
                </button>
                <button
                  onClick={() => setActiveFilter('live')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeFilter === 'live'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Live
                </button>
                <button
                  onClick={() => setActiveFilter('upcoming')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeFilter === 'upcoming'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveFilter('finished')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeFilter === 'finished'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Finished
                </button>
              </div>
              
              {(user?.role === 'speaker' || user?.role === 'admin') && (
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Start Broadcast
                </button>
              )}
            </div>
          </header>

          {/* Stream List */}
          <main className="flex-1 overflow-y-auto p-6">
            <StreamList filter={activeFilter} />
          </main>
        </div>
      </div>
    </StreamProvider>
  );
};

export default Dashboard;