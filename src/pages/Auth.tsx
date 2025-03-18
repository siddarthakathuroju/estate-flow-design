
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import WalletConnect from '@/components/WalletConnect';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900">
            <div className="absolute inset-0 bg-gradient-to-br from-estate-600/20 to-estate-900/50" />
            <img
              src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
              alt="Authentication background"
              className="h-full w-full object-cover opacity-20"
            />
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold text-estate-500">NFT</span>
              <span className="text-xl font-semibold ml-1 text-white">Property</span>
            </Link>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "This platform revolutionized how I invest in real estate. The blockchain
                technology makes transactions secure and transparent."
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="p-4 sm:p-8 lg:p-12">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] md:w-[400px] lg:w-[450px]">
            <div className="flex justify-between items-center">
              <Link 
                to="/" 
                className="flex items-center text-lg font-medium lg:hidden mb-4"
              >
                <span className="text-xl font-semibold text-estate-600">NFT</span>
                <span className="text-xl font-semibold ml-1">Property</span>
              </Link>
              <div className="lg:hidden mb-4">
                <WalletConnect />
              </div>
            </div>
            
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
            
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <div className="hidden lg:block">
                <WalletConnect />
              </div>
              <div className="lg:hidden">
                <Button variant="outline" className="gap-2" onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}>
                  {activeTab === 'login' ? 'Create an account' : 'Sign in'}
                </Button>
              </div>
            </div>
            
            <p className="mt-4 text-center text-sm text-muted-foreground">
              By continuing, you agree to our{' '}
              <Link to="/tos" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
