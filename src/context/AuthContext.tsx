import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { loginWithEmail, loginWithSocial } from '@/services/authService';
import { Tables } from '@/integrations/supabase/types';

// Type for user roles
export type UserRole = 'client' | 'manager' | 'worker';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  // Add other profile fields here
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isManager: boolean;
  isWorker: boolean;
  isClient: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'github' | 'facebook') => Promise<boolean>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (session?.user) {
        // Use setTimeout to prevent potential deadlocks with Supabase client
        setTimeout(async () => {
          await fetchUserProfile(session.user.id);
          setIsAuthenticated(true);
        }, 0);
      } else {
        console.log('No session, clearing user state');
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.email);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Profile fetched:', profile);
      setUser(profile as UserProfile);
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    console.log('Login attempt starting for:', email);
    
    try {
      const user = await loginWithEmail(email, password);
      console.log('Login service response:', user);
      
      if (user) {
        setUser({
          id: user.id,
          email: user.email,
          name: user.name || user.email.split('@')[0],
          role: user.role || 'client' as UserRole,
          avatar_url: user.avatar_url
        });
        setIsAuthenticated(true);
        console.log('Login successful, user set');
        return true;
      }
      console.log('Login failed, no user returned');
      return false;
    } catch (error) {
      console.error('Login failed with error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'github' | 'facebook'): Promise<boolean> => {
    try {
      await loginWithSocial(provider);
      // The actual auth state changes will be caught by the onAuthStateChange listener
      return true;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole = 'client'): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            role: role,
          },
        },
      });

      if (error) {
        console.error('Registration error:', error.message);
        return false;
      }

      if (data.user) {
        // Create a user profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            name,
            role
          });

        if (profileError) {
          console.error('Error creating profile:', profileError.message);
          // Optionally, delete the user if profile creation fails
          await supabase.auth.signOut();
          return false;
        }

        await fetchUserProfile(data.user.id);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
      }
      setUser(null);
      setIsAuthenticated(false);
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    setLoading(true);
    try {
      if (!user) {
        console.error('No user is currently logged in.');
        return false;
      }

      // Ensure role is a valid enum value if it's being updated
      const updateData = { ...data };
      if (updateData.role && !['client', 'manager', 'worker'].includes(updateData.role)) {
        console.error('Invalid role specified');
        return false;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error.message);
        return false;
      }

      // Fetch the updated profile
      await fetchUserProfile(user.id);
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isManager = user?.role === 'manager';
  const isWorker = user?.role === 'worker';
  const isClient = user?.role === 'client';

  const value = {
    user,
    loading,
    isAuthenticated,
    isManager,
    isWorker,
    isClient,
    login,
    socialLogin,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
