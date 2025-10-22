/**
 * Authentication Demo Page
 * Demonstrates login, register, and protected content
 */

import { useState } from 'react';
import { LoginForm } from '../modules/auth/components/LoginForm';
import { RegisterForm } from '../modules/auth/components/RegisterForm';
import { useAuth } from '../modules/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

type TabType = 'login' | 'register';

export const AuthDemo = () => {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Refresh page or navigate after successful auth
    console.log('Authentication successful!');
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Authentication Demo
          </h1>
          <p className="text-muted-foreground text-lg">
            Test the JWT authentication system
          </p>
        </div>

        {/* Auth Status */}
        {isAuthenticated && user ? (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="glass p-6 rounded-2xl border border-green-500/20">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-2">
                    ✓ Authenticated
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Email:</span>{' '}
                      {user.email}
                    </p>
                    {user.name && (
                      <p className="text-foreground">
                        <span className="text-muted-foreground">Name:</span>{' '}
                        {user.name}
                      </p>
                    )}
                    <p className="text-foreground">
                      <span className="text-muted-foreground">ID:</span>{' '}
                      <span className="font-mono text-xs">{user.id}</span>
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">
                        Email Verified:
                      </span>{' '}
                      {user.emailVerified ? '✓ Yes' : '✗ No'}
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">
                        Last Login:
                      </span>{' '}
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="glass p-6 rounded-2xl border border-yellow-500/20">
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                ⓘ Not Authenticated
              </h3>
              <p className="text-muted-foreground text-sm">
                Please login or register to access protected content.
              </p>
            </div>
          </div>
        )}

        {/* Login/Register Forms */}
        {!isAuthenticated && (
          <div className="max-w-md mx-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'login'
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'register'
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                }`}
              >
                Register
              </button>
            </div>

            {/* Forms */}
            {activeTab === 'login' ? (
              <LoginForm onSuccess={handleSuccess} />
            ) : (
              <RegisterForm onSuccess={handleSuccess} />
            )}

            {/* Test User Info */}
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">
                Test User Credentials
              </h4>
              <p className="text-xs text-muted-foreground mb-1">
                Email: <span className="text-blue-400">admin@test.com</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Password: <span className="text-blue-400">password123</span>
              </p>
            </div>
          </div>
        )}

        {/* Protected Content Demo */}
        {isAuthenticated && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="glass p-8 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                🔒 Protected Content
              </h3>
              <p className="text-foreground mb-4">
                This content is only visible to authenticated users!
              </p>
              <p className="text-muted-foreground text-sm">
                You can now access all protected routes and API endpoints. The
                access token will automatically refresh when it expires (every 15
                minutes by default).
              </p>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="text-sm font-semibold text-green-400 mb-2">
                  ✓ What you can do now:
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Access protected API endpoints</li>
                  <li>• Navigate to protected routes</li>
                  <li>• Tokens refresh automatically</li>
                  <li>• Session persists across page reloads</li>
                </ul>
              </div>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                >
                  Go to Home
                </button>
                <button
                  onClick={() => navigate('/protected')}
                  className="px-6 py-2 bg-white/5 text-foreground border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                >
                  Try Protected Route
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documentation Link */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            For implementation details, see{' '}
            <a
              href="/README_AUTH.md"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              README_AUTH.md
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
