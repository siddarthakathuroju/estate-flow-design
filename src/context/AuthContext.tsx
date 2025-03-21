
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getCurrentUser, 
  loginWithEmail, 
  loginWithSocial, 
  registerUser, 
  logout, 
  isLoggedIn,
  User
} from '@/services/authService';

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'github' | 'facebook') => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const loggedInUser = loginWithEmail(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  const socialLogin = async (provider: 'google' | 'github' | 'facebook'): Promise<boolean> => {
    const loggedInUser = loginWithSocial(provider);
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    const newUser = registerUser(email, password, name);
    if (newUser) {
      setUser(newUser);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  // Provide the context value
  const value = {
    user,
    loading,
    login,
    socialLogin,
    register,
    logout: handleLogout,
    isAuthenticated: isLoggedIn()
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Create a custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
