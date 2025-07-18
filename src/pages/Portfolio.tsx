
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Wallet, TrendingUp, TrendingDown, DollarSign, BarChart3, History, ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { calculatePortfolioSummary, getPropertyPerformance, getPortfolioChartData } from "@/services/portfolioService";
import { TransactionHistory } from "@/components/profile/TransactionHistory";
import { useWallet } from '@/hooks/useWallet';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary';
import { ProfitLossDisplay } from '@/components/portfolio/ProfitLossDisplay';

export default function Portfolio() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { isConnected, address, balance } = useWallet();
  
  // If not authenticated, show portfolio preview with login prompt
  const renderAuthPrompt = () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <Hero 
        title="Portfolio Dashboard" 
        subtitle="Track your property investments and performance" 
        backgroundImage="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        className="h-[30vh] md:h-[35vh]"
      />
      
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl -mt-20 relative z-10">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>

        <Alert className="mb-8">
          <BarChart3 className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Please sign in to view your portfolio and track your investments.</span>
            <Button onClick={() => navigate('/auth')} className="ml-4">
              Sign In
            </Button>
          </AlertDescription>
        </Alert>

        {/* Demo Portfolio Preview */}
        <div className="grid gap-6 opacity-50 pointer-events-none">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.00 ETH</div>
                <p className="text-xs text-muted-foreground">Start investing to see your portfolio</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.00 ETH</div>
                <p className="text-xs text-muted-foreground">Returns from your investments</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Properties Owned</CardTitle>
                <AreaChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Number of properties in portfolio</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.00%</div>
                <p className="text-xs text-muted-foreground">Return on investment</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );

  // Show auth prompt if not authenticated
  if (!isAuthenticated) {
    return renderAuthPrompt();
  }
  
  // Get portfolio data
  const portfolioSummary = user ? calculatePortfolioSummary(user.id) : null;
  const propertyPerformance = user ? getPropertyPerformance(user.id) : [];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETH',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(amount).replace('ETH', '') + ' ETH';
  };
  
  // Format percentage
  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(2)}%`;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <Hero 
        title="Portfolio Dashboard" 
        subtitle="Track your property investments and performance" 
        backgroundImage="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        className="h-[30vh] md:h-[35vh]"
      />
      
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl -mt-20 relative z-10">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>

        <div className="grid gap-6">
          {/* Wallet Information Card */}
          {isConnected && address && (
            <Card className="shadow-md border border-border/50 bg-card/95 backdrop-blur mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Connected Wallet</p>
                      <p className="text-xs text-muted-foreground">
                        {address.substring(0, 6)}...{address.substring(address.length - 4)}
                      </p>
                    </div>
                  </div>
                  <div className="pl-0 sm:pl-4 border-l-0 sm:border-l">
                    <p className="text-sm font-medium">Balance</p>
                    <p className="text-xs">{balance ? `${parseFloat(balance).toFixed(4)} ETH` : '...'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Portfolio Summary Cards */}
          {portfolioSummary && (
            <PortfolioSummary 
              totalInvested={portfolioSummary.totalInvested}
              totalReturns={portfolioSummary.totalReturns}
              profit={portfolioSummary.profit}
              profitPercentage={portfolioSummary.profitPercentage}
              propertiesOwned={portfolioSummary.propertiesOwned}
              formatCurrency={formatCurrency}
              formatPercentage={formatPercentage}
            />
          )}
          
          {/* Profit/Loss Display (Replacing Chart) */}
          {portfolioSummary && (
            <ProfitLossDisplay 
              profit={portfolioSummary.profit}
              profitPercentage={portfolioSummary.profitPercentage}
              formatCurrency={formatCurrency}
              formatPercentage={formatPercentage}
            />
          )}
          
          {/* Enhanced Transaction History */}
          <Card className="shadow-md border border-border/50 bg-card/95 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <History className="h-5 w-5" />
                Complete Transaction History
              </CardTitle>
              <CardDescription>Detailed view of all your buy and sell activities</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionHistory />
            </CardContent>
          </Card>
          
          {/* Portfolio Tabs - Property Performance */}
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="mb-5 grid grid-cols-1 w-full max-w-md mx-auto">
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <AreaChart className="h-4 w-4" />
                <span>Property Performance Analysis</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="mt-0">
              <Card className="shadow-md border border-border/50 bg-card/95 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg md:text-xl">Property Performance Breakdown</CardTitle>
                  <CardDescription>Individual property profit and loss analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  {propertyPerformance.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <AreaChart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium">No properties found</h3>
                      <p className="max-w-sm mx-auto mt-2">
                        Start buying properties to see their performance in your portfolio.
                      </p>
                      <Button 
                        onClick={() => navigate('/properties')}
                        className="mt-4"
                      >
                        Browse Properties
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Property</TableHead>
                            <TableHead>Invested</TableHead>
                            <TableHead>Current Value</TableHead>
                            <TableHead>Profit/Loss</TableHead>
                            <TableHead>Performance</TableHead>
                            <TableHead>ROI</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {propertyPerformance.map((property) => (
                            <TableRow key={property.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  {property.image ? (
                                    <img 
                                      src={property.image} 
                                      alt={property.name}
                                      className="w-12 h-12 rounded-md object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center">
                                      <AreaChart className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  )}
                                  <span className="truncate max-w-[140px]">{property.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{formatCurrency(property.invested)}</TableCell>
                              <TableCell>{formatCurrency(property.currentValue)}</TableCell>
                              <TableCell className={property.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {formatCurrency(property.profit)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {property.profit >= 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                  )}
                                  <Badge className={property.profit >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                    {formatPercentage(property.profitPercentage)}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`font-medium ${property.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {property.profitPercentage >= 0 ? '+' : ''}{formatPercentage(property.profitPercentage)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
