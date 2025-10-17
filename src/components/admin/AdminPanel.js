import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Mic, UserCheck, UserX, Search } from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock users data
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Listener', email: 'alice@example.com', role: 'listener', joinDate: '2024-01-15' },
    { id: 2, name: 'John Speaker', email: 'john@example.com', role: 'speaker', joinDate: '2024-01-10' },
    { id: 3, name: 'Bob Listener', email: 'bob@example.com', role: 'listener', joinDate: '2024-01-20' },
    { id: 4, name: 'dakshath', email: 'dakshath@streamvoice.com', role: 'listener', joinDate: '2024-01-25' },
  ]);

  const promoteToSpeaker = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: 'speaker' } : u
    ));
  };

  const demoteToListener = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: 'listener' } : u
    ));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const listeners = filteredUsers.filter(u => u.role === 'listener');
  const speakers = filteredUsers.filter(u => u.role === 'speaker');

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage users and platform settings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Speakers</p>
                <p className="text-2xl font-bold text-white">{speakers.length}</p>
              </div>
              <Mic className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Listeners</p>
                <p className="text-2xl font-bold text-white">{listeners.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">User Management</h2>
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium">User</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Role</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Join Date</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'speaker' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{user.joinDate}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {user.role === 'listener' ? (
                          <button
                            onClick={() => promoteToSpeaker(user.id)}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            <UserCheck className="h-4 w-4" />
                            <span>Make Speaker</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => demoteToListener(user.id)}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            <UserX className="h-4 w-4" />
                            <span>Make Listener</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;