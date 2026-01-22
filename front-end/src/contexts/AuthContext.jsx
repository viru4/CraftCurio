import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '@/utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Logout error:', error);
      }
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Set token and user from storage immediately
          setToken(storedToken);
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Verify token is still valid in the background
          const response = await api.get('/auth/me');

          if (response.data && response.data.user) {
            // Update with fresh user data from server
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          // Only logout if we get an explicit auth error (401/403)
          if (error.response?.status === 401 || error.response?.status === 403) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          } else if (import.meta.env.DEV) {
            console.error('Auth initialization error:', error);
          }
          // Don't logout on network errors - keep the user logged in
          // Only clear auth on explicit authentication failures
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for storage events to update user data when profile is updated
    const handleStorageChange = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isBuyer: user?.role === 'buyer',
    isArtisan: user?.role === 'artisan',
    isCollector: user?.role === 'collector',
    isAdmin: user?.role === 'admin',
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
