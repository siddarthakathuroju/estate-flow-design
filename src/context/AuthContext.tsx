
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

// Define the AuthContext type with KYC status
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'github' | 'facebook') => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  kycStatus: 'not_started' | 'pending' | 'verified';
  updateKycStatus: (status: 'not_started' | 'pending' | 'verified') => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<'not_started' | 'pending' | 'verified'>('not_started');

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Check KYC status from localStorage
    const savedKycStatus = localStorage.getItem('kyc_status');
    if (savedKycStatus && ['not_started', 'pending', 'verified'].includes(savedKycStatus)) {
      setKycStatus(savedKycStatus as 'not_started' | 'pending' | 'verified');
    }
    
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

  const updateKycStatus = (status: 'not_started' | 'pending' | 'verified') => {
    setKycStatus(status);
    localStorage.setItem('kyc_status', status);
  };

  // Provide the context value
  const value = {
    user,
    loading,
    login,
    socialLogin,
    register,
    logout: handleLogout,
    isAuthenticated: isLoggedIn(),
    kycStatus,
    updateKycStatus
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
