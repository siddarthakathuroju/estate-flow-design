
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Wallet, TrendingUp, TrendingDown, DollarSign, BarChart3, History, LineChart } from 'lucide-react';
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
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { calculatePortfolioSummary, getPropertyPerformance, getPortfolioChartData } from "@/services/portfolioService";
import { getUserTransactionHistory } from "@/services/transactionService";
import { TransactionHistory } from "@/components/profile/TransactionHistory";
import { PortfolioChart } from "@/components/portfolio/PortfolioChart";
import { useWalletConnection } from '@/hooks/use-wallet';

export default function Portfolio() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { isActive, account, balance } = useWalletConnection();
  
  // Use useEffect for navigation to prevent the React warning
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);
  
  // If not authenticated, return a loading state instead of null
  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-6xl">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Loading Portfolio...</h2>
            <p className="text-muted-foreground">Please sign in to view your portfolio</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Get portfolio data
  const portfolioSummary = user ? calculatePortfolioSummary(user.id) : null;
  const propertyPerformance = user ? getPropertyPerformance(user.id) : [];
  const portfolioChartData = user ? getPortfolioChartData(user.id) : [];
  
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
    <div className="container py-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Portfolio Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your property investments and performance</p>
        </div>
        
        {/* Wallet Information Card */}
        {isActive && account && (
          <Card className="w-full sm:w-auto shrink-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Connected Wallet</p>
                <p className="text-xs text-muted-foreground">
                  {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </p>
              </div>
              <div className="pl-2 border-l">
                <p className="text-sm font-medium">Balance</p>
                <p className="text-xs">{balance ? `${parseFloat(balance).toFixed(4)} ETH` : '...'}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Invested</p>
                <h2 className="text-lg sm:text-xl font-bold mt-1">
                  {portfolioSummary ? formatCurrency(portfolioSummary.totalInvested) : '0 ETH'}
                </h2>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Returns</p>
                <h2 className="text-lg sm:text-xl font-bold mt-1">
                  {portfolioSummary ? formatCurrency(portfolioSummary.totalReturns) : '0 ETH'}
                </h2>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Profit/Loss</p>
                <div className="flex items-center mt-1">
                  <h2 className="text-lg sm:text-xl font-bold">
                    {portfolioSummary ? formatCurrency(portfolioSummary.profit) : '0 ETH'}
                  </h2>
                  {portfolioSummary && portfolioSummary.profit !== 0 && (
                    <Badge className={`ml-2 ${portfolioSummary.profit > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {formatPercentage(portfolioSummary.profitPercentage)}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                {portfolioSummary && portfolioSummary.profit >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Properties Owned</p>
                <h2 className="text-lg sm:text-xl font-bold mt-1">
                  {portfolioSummary ? portfolioSummary.propertiesOwned : 0}
                </h2>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Portfolio value chart */}
      <div className="mb-6">
        <PortfolioChart 
          data={portfolioChartData} 
          title="Portfolio Value Over Time"
          description="Track your portfolio's performance"
        />
      </div>
      
      {/* Portfolio Tabs - Property Performance and Transaction History */}
      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="mb-5 grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <AreaChart className="h-4 w-4" />
            <span>Property Performance</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>Transaction History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Property Performance</CardTitle>
              <CardDescription>Track the profit and loss for each property</CardDescription>
            </CardHeader>
            <CardContent>
              {propertyPerformance.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AreaChart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <h3 className="text-lg font-medium">No properties found</h3>
                  <p className="max-w-sm mx-auto mt-1">
                    Start buying properties to see their performance in your portfolio.
                  </p>
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
                                  className="w-10 h-10 rounded-md object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center">
                                  <AreaChart className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <span className="truncate max-w-[140px]">{property.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(property.invested)}</TableCell>
                          <TableCell>{formatCurrency(property.currentValue)}</TableCell>
                          <TableCell>{formatCurrency(property.profit)}</TableCell>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-0">
          <TransactionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
