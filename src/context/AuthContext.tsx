import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
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
  register: (email: string, password: string, name: string, role?: string) => Promise<boolean>;
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
    const session = supabase.auth.getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.session?.user) {
        await fetchUserProfile(session.session.user.id);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    if (session?.data?.session?.user) {
      fetchUserProfile(session.data.session.user.id);
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setUser(profile as UserProfile);
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (data.user) {
        await fetchUserProfile(data.user.id);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: string = 'client'): Promise<boolean> => {
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
          .insert([{ id: data.user.id, email, name, role }]);

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

      const { error } = await supabase
        .from('profiles')
        .update(data)
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
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
