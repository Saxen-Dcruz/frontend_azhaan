// src/components/dashboard/AdminDashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import { BarChart3, Users, Mic, Headphones, DollarSign, TrendingUp, Calendar, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'blue' },
    { label: 'Active Streams', value: '28', change: '+5%', icon: Mic, color: 'green' },
    { label: 'Total Revenue', value: '$12,456', change: '+18%', icon: DollarSign, color: 'purple' },
    { label: 'Avg. Listeners', value: '156', change: '+8%', icon: Headphones, color: 'orange' }
  ];

  const recentActivities = [
    { id: 1, user: 'John Speaker', action: 'started a new stream', time: '5 min ago' },
    { id: 2, user: 'Alice Listener', action: 'subscribed to premium', time: '12 min ago' },
    { id: 3, user: 'Bob Listener', action: 'joined platform', time: '1 hour ago' },
    { id: 4, user: 'Sarah Speaker', action: 'scheduled stream', time: '2 hours ago' }
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={logout} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Manage your platform and users</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/admin')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                User Management
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Generate Reports
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            {stats.map((stat, index) => (
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

          {/* Admin Tabs */}
          <div className="flex space-x-4 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-750 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {activity.user.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-gray-400 text-xs">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Health */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Platform Health</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Server Uptime', value: '99.9%', status: 'good' },
                      { label: 'API Response', value: '125ms', status: 'good' },
                      { label: 'Active Connections', value: '2,458', status: 'normal' },
                      { label: 'Error Rate', value: '0.2%', status: 'good' }
                    ].map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300">{metric.label}</span>
                        <span className={`font-medium ${
                          metric.status === 'good' ? 'text-green-400' : 
                          metric.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 bg-gray-750 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors text-left">
                    <Users className="h-8 w-8 text-blue-400 mb-2" />
                    <h4 className="text-white font-semibold">Manage Users</h4>
                    <p className="text-gray-400 text-sm mt-1">View and manage all users</p>
                  </button>
                  <button className="p-4 bg-gray-750 rounded-lg border border-gray-600 hover:border-green-500 transition-colors text-left">
                    <Mic className="h-8 w-8 text-green-400 mb-2" />
                    <h4 className="text-white font-semibold">Stream Analytics</h4>
                    <p className="text-gray-400 text-sm mt-1">View stream performance</p>
                  </button>
                  <button className="p-4 bg-gray-750 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors text-left">
                    <BarChart3 className="h-8 w-8 text-purple-400 mb-2" />
                    <h4 className="text-white font-semibold">Revenue Reports</h4>
                    <p className="text-gray-400 text-sm mt-1">Generate financial reports</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;