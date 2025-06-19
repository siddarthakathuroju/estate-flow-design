
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Settings, User, Clock, History, CreditCard, ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TransactionHistory } from "@/components/profile/TransactionHistory";
import { useAuth } from "@/context/AuthContext";
import { addTransaction } from "@/services/transactionService";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.name) return user?.email.substring(0, 2).toUpperCase();
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Add some mock transactions for demo purposes
  const handleAddMockTransaction = (type: 'buy' | 'sell') => {
    if (!user) return;
    
    const properties = [
      { id: '1', name: 'Luxury Villa with Pool', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6' },
      { id: '2', name: 'Downtown Apartment', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267' },
      { id: '3', name: 'Beachfront Property', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9' },
      { id: '4', name: 'Mountain Cabin', image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6' }
    ];
    
    const statuses: Array<'completed' | 'pending' | 'failed'> = ['completed', 'pending', 'failed'];
    const property = properties[Math.floor(Math.random() * properties.length)];
    const amount = type === 'buy' ? (Math.random() * 10 + 1).toFixed(4) : (Math.random() * 5 + 1).toFixed(4);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    addTransaction({
      userId: user.id,
      propertyId: property.id,
      propertyName: property.name,
      propertyImage: property.image,
      type,
      amount: parseFloat(amount),
      status
    });
    
    // Force a component re-render
    setForceUpdate(prev => prev + 1);
  };
  
  // State to force component re-renders
  const [forceUpdate, setForceUpdate] = useState(0);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container py-8 max-w-6xl mt-16">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/properties')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Properties
        </Button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - Profile info */}
          <div className="w-full md:w-1/3 space-y-6">
            <Card>
              <CardHeader className="relative pb-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user?.avatar_url} alt={user?.name || user?.email} />
                    <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-center">{user?.name || 'User'}</CardTitle>
                  <CardDescription className="text-center">{user?.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Member since</span>
                    <span>May 2023</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Properties owned</span>
                    <span>3</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Wallet connected</span>
                    <span className="text-green-600">Yes</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
            
            {/* Demo panel for adding mock transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Demo Actions</CardTitle>
                <CardDescription>Add sample transactions for demo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => handleAddMockTransaction('buy')} 
                  variant="outline"
                  className="w-full mb-2"
                >
                  Add Sample Purchase
                </Button>
                <Button 
                  onClick={() => handleAddMockTransaction('sell')} 
                  variant="outline"
                  className="w-full"
                >
                  Add Sample Sale
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Tabs with transaction history */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="w-full mb-6 grid grid-cols-3">
                <TabsTrigger value="properties" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Properties</span>
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span>Transactions</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Payments</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="properties" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>My Properties</CardTitle>
                    <CardDescription>Properties you currently own or have listed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                      <h3 className="text-lg font-medium">Coming Soon</h3>
                      <p className="max-w-sm mx-auto mt-1">
                        This feature is currently under development.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="transactions" className="mt-0">
                <TransactionHistory key={forceUpdate} />
              </TabsContent>
              
              <TabsContent value="payments" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                      <h3 className="text-lg font-medium">Coming Soon</h3>
                      <p className="max-w-sm mx-auto mt-1">
                        This feature is currently under development.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
