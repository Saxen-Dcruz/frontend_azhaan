import React from 'react';
import PropTypes from 'prop-types';
import { 
  Home, 
  Settings,
  LogOut,
  Users,
  Mic
} from 'lucide-react';

const Sidebar = ({ activeFilter, setActiveFilter, user, onLogout }) => {
  const navItems = [
    { id: 'all', label: 'Dashboard', icon: Home },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const adminItems = [
    { id: 'users', label: 'User Management', icon: Users },
  ];

  return (
    <div className="w-64 bg-gray-800 flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Mic className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold text-white">StreamVoice</h1>
            <p className="text-gray-400 text-sm">Audio Platform</p>
          </div>
        </div>
      </div>
        {/* User Info Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 px-4 py-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
  <span className="text-white font-semibold text-sm">
    {user?.avatar || user?.username?.charAt(0).toUpperCase()}
  </span>
</div>
<div className="flex-1 min-w-0">
  <p className="text-white font-medium text-sm truncate">{user?.username}</p>
  <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
</div>

        </div>
        </div>
        
      {/* Navigation Section */}
      <div className="flex-1 p-4">
        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 px-4">
          Navigation
        </h3>
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFilter(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeFilter === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <>
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-6 mb-4 px-4">
              Admin
            </h3>
            <div className="space-y-2">
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700">
        

        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-200 transition-colors mt-2"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

// PropTypes validation
Sidebar.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  setActiveFilter: PropTypes.func.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
    avatar: PropTypes.string,
    username: PropTypes.string,
  }),
  
  onLogout: PropTypes.func.isRequired,
};

export default Sidebar;
