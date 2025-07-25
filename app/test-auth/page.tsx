'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function TestAuthPage() {
  const { user, loading, error, signInWithEmail, signUpWithEmail, signInWithGoogle, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google auth error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Auth Test Page</h1>
        
        {/* User Status */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Current Status:</h2>
          {user ? (
            <div>
              <p><strong>Logged in as:</strong> {user.displayName || user.email}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>UID:</strong> {user.uid}</p>
              {user.photoURL && (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full mt-2"
                  loading="lazy"
                />
              )}
              <button
                onClick={handleLogout}
                className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <p>Not logged in</p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-600 p-4 rounded-lg mb-6">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        {/* Auth Forms */}
        {!user && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex mb-4">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 px-4 rounded-l ${!isSignUp ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 px-4 rounded-r ${isSignUp ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    required={isSignUp}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4">
              <button
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-gray-900 hover:bg-gray-100 py-2 px-4 rounded flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        )}

        {/* Test Instructions */}
        <div className="mt-8 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Try signing up with email/password</li>
            <li>Try signing in with the same credentials</li>
            <li>Try Google OAuth (if configured)</li>
            <li>Test logout functionality</li>
            <li>Refresh the page to verify persistence</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 