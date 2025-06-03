import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// API base URL - update this to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  walletAddress?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  signup: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateWallet: (address: string) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (!token || !userData) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        // First set the stored data
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);

        // Then verify with the backend
        try {
          const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            // Update with fresh data from server
            setUser(data.data.user);
            setIsAuthenticated(true);
          } else {
            // Token is invalid - clear everything
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          // Network error - keep using stored data
          console.error('Token verification failed:', error);
          // Don't clear authentication on network errors
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear everything on initialization error
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []); 

  const login = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const { user: userData, token } = data.data;

      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: { name: string; email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Signup failed');
      }

      if (!responseData.success) {
        throw new Error(responseData.message || 'Signup failed');
      }

      const { user: userData, token } = responseData.data;

      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWallet = async (address: string) => {
    try {
      setError(null);
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/wallet`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update wallet');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to update wallet');
      }

      // Update user data with new wallet address
      const updatedUser = { ...user!, walletAddress: address };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      signup, 
      logout, 
      updateWallet,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};