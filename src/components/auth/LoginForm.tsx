
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { LogIn, Github } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const { login, socialLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setLoginError(null);
    
    console.log('Login attempt with:', { email: data.email });
    
    try {
      const success = await login(data.email, data.password);
      console.log('Login result:', success);
      
      if (success) {
        toast({
          title: 'Login successful!',
          description: 'Welcome back to NFT Property',
        });
        // Small delay to ensure auth state is updated
        setTimeout(() => {
          navigate('/properties');
        }, 100);
      } else {
        console.error('Login failed: success was false');
        setLoginError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.message || 'An unexpected error occurred. Please try again.';
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
    setIsLoading(true);
    try {
      console.log(`Attempting ${provider} login`);
      const success = await socialLogin(provider);
      
      if (success !== false) {
        toast({
          title: 'Redirecting...',
          description: `Connecting with ${provider}`,
        });
        // OAuth will handle the redirect
      }
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast({
        variant: 'destructive',
        title: 'Social login configuration needed',
        description: `Please configure ${provider} login in your Supabase dashboard under Authentication > Providers`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to sign in to your account</p>
      </div>
      
      {loginError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}
      
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Social Login Setup Required:</strong> To enable Google/GitHub login, configure OAuth providers in your Supabase dashboard under Authentication > Providers.
        </AlertDescription>
      </Alert>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'} <LogIn className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <Button 
          variant="outline" 
          type="button" 
          disabled={isLoading}
          onClick={() => handleSocialLogin('google')}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          disabled={isLoading}
          onClick={() => handleSocialLogin('github')}
        >
          <Github className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          disabled={isLoading}
          onClick={() => handleSocialLogin('facebook')}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
        </Button>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p><strong>To enable social login:</strong></p>
        <p>1. Go to Supabase Dashboard → Authentication → Providers</p>
        <p>2. Enable and configure Google/GitHub OAuth</p>
        <p>3. Add your app's redirect URLs</p>
      </div>
    </div>
  );
}
