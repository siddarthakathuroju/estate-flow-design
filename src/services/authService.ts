
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/context/AuthContext";
import { Tables } from "@/integrations/supabase/types";

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
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
      return null;
    }

    if (!data.user) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Could not create user",
      });
      return null;
    }

    // Return user without password
    const newUser: User = {
      id: data.user.id,
      email: data.user.email || email,
      name: name || email.split('@')[0],
      role,
    };

    // Save to localStorage
    saveCurrentUser(newUser);
    
    toast({
      title: "Registration successful",
      description: "Your account has been created",
    });
    
    return newUser;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Registration failed",
      description: error.message || "An error occurred during registration",
    });
    return null;
  }
};

// Login with email/password
export const loginWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
      return null;
    }

    if (!data.user) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password",
      });
      return null;
    }

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
      role: profile?.role as UserRole,
      avatar_url: profile?.avatar_url,
    };

    // Save to localStorage
    saveCurrentUser(user);
    
    toast({
      title: "Login successful",
      description: "You have been logged in",
    });
    
    return user;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Login failed",
      description: error.message || "An error occurred during login",
    });
    return null;
  }
};

// Social login - properly implemented with Supabase OAuth
export const loginWithSocial = async (provider: 'google' | 'github' | 'facebook'): Promise<User | null> => {
  try {
    // Initiate OAuth flow with Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth`
      }
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Social login failed",
        description: error.message,
      });
      return null;
    }
    
    // The actual user data will be handled when the redirect happens
    // This function just initiates the redirect
    return null;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Social login failed",
      description: error.message || `An error occurred during ${provider} login`,
    });
    return null;
  }
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
      role: profile?.role as UserRole,
      avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
    };
    
    // Save to localStorage
    saveCurrentUser(userObj);
    
    toast({
      title: "Login successful",
      description: "You have been logged in with social account",
    });
    
    return userObj;
  } catch (error: any) {
    console.error('Error handling auth redirect:', error);
    return null;
  }
};

// Save current user to localStorage
const saveCurrentUser = (user: User | null) => {
  if (user) {
    // Remove password before saving to current user
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('nft_property_current_user', JSON.stringify(userWithoutPassword));
  } else {
    localStorage.removeItem('nft_property_current_user');
  }
};

// Logout
export const logout = async () => {
  try {
    await supabase.auth.signOut();
    saveCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    toast({
      variant: "destructive",
      title: "Logout failed",
      description: error.message || "An error occurred during logout",
    });
  }
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return getCurrentUser() !== null;
};
