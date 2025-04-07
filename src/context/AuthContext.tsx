
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
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Define the possible role types
export type UserRole = 'manager' | 'worker' | 'client';

// Extend the User type to include role
export interface ExtendedUser extends User {
  role?: UserRole;
  phone?: string;
  address?: string;
  verified?: boolean;
}

// Define the AuthContext type with KYC status and role
interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'github' | 'facebook') => Promise<boolean>;
  register: (email: string, password: string, name?: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  kycStatus: 'not_started' | 'pending' | 'verified';
  updateKycStatus: (status: 'not_started' | 'pending' | 'verified') => void;
  refreshUserProfile: () => Promise<void>;
  isManager: boolean;
  isWorker: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<'not_started' | 'pending' | 'verified'>('not_started');

  // Function to fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data as Tables<'profiles'>;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Function to refresh the current user's profile
  const refreshUserProfile = async () => {
    if (!user?.id) return;
    
    const profile = await fetchUserProfile(user.id);
    if (profile) {
      setUser({
        ...user,
        role: profile.role as UserRole,
        name: profile.name || user.name,
        phone: profile.phone_text,
        address: profile.address,
        verified: profile.verified,
      });
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const currentUser = getCurrentUser();
      
      if (currentUser?.id) {
        const profile = await fetchUserProfile(currentUser.id);
        
        if (profile) {
          setUser({
            ...currentUser,
            role: profile.role as UserRole,
            phone: profile.phone_text,
            address: profile.address,
            verified: profile.verified,
          });
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      
      // Check KYC status from localStorage
      const savedKycStatus = localStorage.getItem('kyc_status');
      if (savedKycStatus && ['not_started', 'pending', 'verified'].includes(savedKycStatus)) {
        setKycStatus(savedKycStatus as 'not_started' | 'pending' | 'verified');
      }
      
      setLoading(false);
    };
    
    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          const currentUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.email?.split('@')[0] || '',
            role: profile?.role as UserRole,
            phone: profile?.phone_text,
            address: profile?.address,
            verified: profile?.verified,
          };
          
          setUser(currentUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        const loggedInUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: profile?.name || data.user.email?.split('@')[0] || '',
          role: profile?.role as UserRole,
          phone: profile?.phone_text,
          address: profile?.address,
          verified: profile?.verified,
        };
        
        setUser(loggedInUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const socialLogin = async (provider: 'google' | 'github' | 'facebook'): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        throw error;
      }
      
      // For OAuth, we can't immediately set the user since it redirects
      return !!data;
    } catch (error) {
      console.error('Social login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name?: string, role: UserRole = 'client'): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // We don't need to manually set the user here as the onAuthStateChange 
        // listener will pick up the SIGNED_IN event
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout(); // Also call the local logout function to clear localStorage
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateKycStatus = (status: 'not_started' | 'pending' | 'verified') => {
    setKycStatus(status);
    localStorage.setItem('kyc_status', status);
  };

  // Calculate role-based permissions
  const isManager = user?.role === 'manager';
  const isWorker = user?.role === 'worker';

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
    updateKycStatus,
    refreshUserProfile,
    isManager,
    isWorker
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
