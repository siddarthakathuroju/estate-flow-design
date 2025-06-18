
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/context/AuthContext";

// Define the User type with proper structure
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  password?: string; // Adding password as optional for internal use
  role?: UserRole;
}

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('nft_property_current_user');
  return user ? JSON.parse(user) : null;
};

// Register a new user
export const registerUser = async (email: string, password: string, name?: string, role: UserRole = 'client'): Promise<User | null> => {
  try {
    console.log('Registering user:', { email, name, role });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        }
      }
    });

    if (error) {
      console.error('Registration error:', error);
      throw error;
    }

    if (!data.user) {
      throw new Error('Could not create user');
    }

    // Return user without password
    const newUser: User = {
      id: data.user.id,
      email: data.user.email || email,
      name: name || email.split('@')[0],
      role,
    };

    console.log('Registration successful:', newUser);
    return newUser;
  } catch (error: any) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Login with email/password
export const loginWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    console.log('Attempting login with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      throw error;
    }

    if (!data.user) {
      throw new Error('Invalid email or password');
    }

    console.log('Login successful for user:', data.user.id);

    // Fetch user profile from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // Create user object
    const user: User = {
      id: data.user.id,
      email: data.user.email || email,
      name: profile?.name || data.user.email?.split('@')[0] || '',
      role: (profile?.role as UserRole) || 'client',
      avatar_url: profile?.avatar_url,
    };

    console.log('User profile loaded:', user);
    return user;
  } catch (error: any) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Social login - removed for now since providers are not configured
export const loginWithSocial = async (provider: 'google' | 'github' | 'facebook'): Promise<User | null> => {
  throw new Error(`${provider} login is not configured in this environment`);
};

// Handle OAuth results after redirect
export const handleAuthRedirect = async (): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    
    if (!data.session?.user) {
      return null;
    }
    
    const user = data.session.user;
    
    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    // Create user object
    const userObj: User = {
      id: user.id,
      email: user.email || '',
      name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || '',
      role: (profile?.role as UserRole) || 'client',
      avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
    };
    
    console.log('OAuth redirect user loaded:', userObj);
    return userObj;
  } catch (error: any) {
    console.error('Error handling auth redirect:', error);
    return null;
  }
};

// Logout
export const logout = async () => {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem('nft_property_current_user');
    console.log('Logout successful');
  } catch (error: any) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return getCurrentUser() !== null;
};
