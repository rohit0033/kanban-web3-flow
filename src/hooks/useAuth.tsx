
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  signup: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const generateAvatar = async () => {
    const randomId = Math.floor(Math.random() * 1000);
    try {
      const response = await fetch(`https://picsum.photos/id/${randomId}/info`);
      const data = await response.json();
      return data.download_url;
    } catch (error) {
      return `https://picsum.photos/200/200?random=${randomId}`;
    }
  };

  const login = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const avatar = await generateAvatar();
    const userData = {
      id: '1',
      name: credentials.email.split('@')[0],
      email: credentials.email,
      avatar
    };

    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const signup = async (data: { name: string; email: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const avatar = await generateAvatar();
    const userData = {
      id: '1',
      name: data.name,
      email: data.email,
      avatar
    };

    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
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
