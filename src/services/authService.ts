
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

// Mock user storage - in a real app, this would be handled by a backend
const USERS_STORAGE_KEY = 'nft_property_users';
const CURRENT_USER_KEY = 'nft_property_current_user';

// Get users from localStorage
const getUsers = (): Record<string, User> => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : {};
};

// Save users to localStorage
const saveUsers = (users: Record<string, User>) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Save current user to localStorage
const saveCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Register a new user
export const registerUser = (email: string, password: string, name?: string): User | null => {
  const users = getUsers();
  
  // Check if email already exists
  if (users[email]) {
    toast({
      variant: "destructive",
      title: "Registration failed",
      description: "This email is already registered",
    });
    return null;
  }
  
  // Create new user
  const newUser = {
    id: crypto.randomUUID(),
    email,
    name: name || email.split('@')[0], // Use part of email as name if not provided
    password, // In a real app, this would be hashed
  };
  
  // Save to localStorage
  users[email] = newUser;
  saveUsers(users);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Login with email/password
export const loginWithEmail = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users[email];
  
  if (!user || user.password !== password) {
    toast({
      variant: "destructive",
      title: "Login failed",
      description: "Invalid email or password",
    });
    return null;
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  saveCurrentUser(userWithoutPassword);
  return userWithoutPassword;
};

// Mock social login
export const loginWithSocial = (provider: 'google' | 'github' | 'facebook'): User | null => {
  // In a real app, this would redirect to OAuth flow
  // For demo purposes, create a mock user
  const mockEmail = `user_${provider}_${Date.now()}@example.com`;
  const mockUser = {
    id: crypto.randomUUID(),
    email: mockEmail,
    name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockEmail}`,
  };
  
  // Save to localStorage
  const users = getUsers();
  users[mockEmail] = mockUser;
  saveUsers(users);
  saveCurrentUser(mockUser);
  
  toast({
    title: "Login successful",
    description: `Logged in with ${provider}`,
  });
  
  return mockUser;
};

// Logout
export const logout = () => {
  saveCurrentUser(null);
  toast({
    title: "Logged out",
    description: "You have been logged out successfully",
  });
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return getCurrentUser() !== null;
};

