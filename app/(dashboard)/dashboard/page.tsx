'use client';

import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Welcome back, {user?.displayName || user?.email}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-white"
          >
            Logout
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Display Name</p>
              <p className="text-white">{user?.displayName || 'Not set'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">User ID</p>
              <p className="text-white font-mono text-sm">{user?.uid}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Account Created</p>
              <p className="text-white">
                {user?.metadata?.creationTime 
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : 'Unknown'
                }
              </p>
            </div>
          </div>
          {user?.photoURL && (
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">Profile Picture</p>
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-16 h-16 rounded-full"
              />
            </div>
          )}
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Projects</h3>
            <p className="text-3xl font-bold text-blue-500">0</p>
            <p className="text-gray-400 text-sm">No projects yet</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Achievements</h3>
            <p className="text-3xl font-bold text-green-500">0</p>
            <p className="text-gray-400 text-sm">No achievements yet</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Participation</h3>
            <p className="text-3xl font-bold text-purple-500">0</p>
            <p className="text-gray-400 text-sm">No participations yet</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors text-white">
              <h3 className="font-semibold mb-2">Create Project</h3>
              <p className="text-sm text-gray-300">Start a new hackathon project</p>
            </button>
            <button className="bg-green-600 hover:bg-green-700 p-4 rounded-lg transition-colors text-white">
              <h3 className="font-semibold mb-2">Join Hackathon</h3>
              <p className="text-sm text-gray-300">Participate in upcoming events</p>
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg transition-colors text-white">
              <h3 className="font-semibold mb-2">View Achievements</h3>
              <p className="text-sm text-gray-300">See your earned badges</p>
            </button>
          </div>
        </div>

        {/* Layout Test Info */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">🎯 Dashboard Layout Test</h2>
          <p className="text-gray-300 mb-4">
            This page is now using the new route group layout. The navbar and authentication are handled automatically.
          </p>
          <div className="bg-gray-700 rounded p-4">
            <p className="text-sm text-gray-300">
              <strong>Layout Features:</strong>
            </p>
            <ul className="text-sm text-gray-400 mt-2 space-y-1">
              <li>• Automatic authentication protection</li>
              <li>• Responsive navbar integration</li>
              <li>• Proper content spacing</li>
              <li>• Loading states during auth checks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 