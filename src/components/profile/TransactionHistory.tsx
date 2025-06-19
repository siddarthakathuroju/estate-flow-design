
import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, AlertCircle, Coins, Filter, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Transaction, getUserTransactionHistory } from "@/services/transactionService";
import { useAuth } from "@/context/AuthContext";

export function TransactionHistory() {
  const { user } = useAuth();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'buy' | 'sell' | 'completed' | 'pending' | 'failed'>('all');
  
  // Get transaction history
  const allTransactions = user ? getUserTransactionHistory(user.id) : [];
  
  // Filter transactions based on selected filter
  const filteredTransactions = allTransactions.filter(transaction => {
    switch (selectedFilter) {
      case 'buy':
        return transaction.type === 'buy';
      case 'sell':
        return transaction.type === 'sell';
      case 'completed':
        return transaction.status === 'completed';
      case 'pending':
        return transaction.status === 'pending';
      case 'failed':
        return transaction.status === 'failed';
      default:
        return true;
    }
  });
  
  // Calculate statistics
  const totalBuys = allTransactions.filter(t => t.type === 'buy').length;
  const totalSells = allTransactions.filter(t => t.type === 'sell').length;
  const totalSpent = allTransactions.filter(t => t.type === 'buy' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalEarned = allTransactions.filter(t => t.type === 'sell' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalEarned - totalSpent;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETH',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(amount).replace('ETH', '') + ' ETH';
  };
  
  // Get transaction icon based on type
  const getTransactionIcon = (type: 'buy' | 'sell') => {
    return type === 'buy' 
      ? <ArrowUpRight className="h-4 w-4 text-green-500" /> 
      : <ArrowDownLeft className="h-4 w-4 text-blue-500" />;
  };
  
  // Get status icon based on status
  const getStatusIcon = (status: 'completed' | 'pending' | 'failed') => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };
  
  // Get status badge based on status
  const getStatusBadge = (status: 'completed' | 'pending' | 'failed') => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Failed</Badge>;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy • HH:mm');
  };
  
  return (
    <div className="space-y-6">
      {/* Transaction Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Purchases</p>
                <h3 className="text-2xl font-bold text-green-600">{totalBuys}</h3>
              </div>
              <ArrowUpRight className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Sales</p>
                <h3 className="text-2xl font-bold text-blue-600">{totalSells}</h3>
              </div>
              <ArrowDownLeft className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Spent</p>
                <h3 className="text-lg font-bold">{formatCurrency(totalSpent)}</h3>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Net P&L</p>
                <h3 className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netProfit)}
                </h3>
              </div>
              {netProfit >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Transaction History */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Complete record of your property transactions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Collapsible
                open={isFiltersOpen}
                onOpenChange={setIsFiltersOpen}
                className="relative"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute right-0 top-full mt-2 z-10 bg-white shadow-md rounded-md p-4 border w-[200px]">
                  <div className="space-y-2">
                    <div className="font-medium">Quick Filters:</div>
                    <div className="space-y-1">
                      <Button 
                        variant={selectedFilter === 'all' ? 'default' : 'ghost'} 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setSelectedFilter('all')}
                      >
                        All Transactions
                      </Button>
                      <Button 
                        variant={selectedFilter === 'buy' ? 'default' : 'ghost'} 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setSelectedFilter('buy')}
                      >
                        Purchases Only
                      </Button>
                      <Button 
                        variant={selectedFilter === 'sell' ? 'default' : 'ghost'} 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setSelectedFilter('sell')}
                      >
                        Sales Only
                      </Button>
                      <Button 
                        variant={selectedFilter === 'completed' ? 'default' : 'ghost'} 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setSelectedFilter('completed')}
                      >
                        Completed
                      </Button>
                      <Button 
                        variant={selectedFilter === 'pending' ? 'default' : 'ghost'} 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setSelectedFilter('pending')}
                      >
                        Pending
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({allTransactions.length})</TabsTrigger>
              <TabsTrigger value="buy">Purchases ({totalBuys})</TabsTrigger>
              <TabsTrigger value="sell">Sales ({totalSells})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {renderTransactionsTable(filteredTransactions, {
                formatCurrency,
                getTransactionIcon,
                getStatusIcon,
                getStatusBadge,
                formatDate
              })}
            </TabsContent>
            
            <TabsContent value="buy" className="mt-0">
              {renderTransactionsTable(
                allTransactions.filter(t => t.type === 'buy'),
                {
                  formatCurrency,
                  getTransactionIcon,
                  getStatusIcon,
                  getStatusBadge,
                  formatDate
                }
              )}
            </TabsContent>
            
            <TabsContent value="sell" className="mt-0">
              {renderTransactionsTable(
                allTransactions.filter(t => t.type === 'sell'),
                {
                  formatCurrency,
                  getTransactionIcon,
                  getStatusIcon,
                  getStatusBadge,
                  formatDate
                }
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to render transactions table
function renderTransactionsTable(
  transactions: Transaction[], 
  helpers: {
    formatCurrency: (amount: number) => string;
    getTransactionIcon: (type: 'buy' | 'sell') => JSX.Element;
    getStatusIcon: (status: 'completed' | 'pending' | 'failed') => JSX.Element;
    getStatusBadge: (status: 'completed' | 'pending' | 'failed') => JSX.Element;
    formatDate: (dateString: string) => string;
  }
) {
  const { formatCurrency, getTransactionIcon, getStatusIcon, getStatusBadge, formatDate } = helpers;
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Coins className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-medium">No transactions found</h3>
        <p className="max-w-sm mx-auto mt-1">
          When you buy or sell properties, your transactions will appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Impact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {transaction.propertyImage ? (
                    <img 
                      src={transaction.propertyImage} 
                      alt={transaction.propertyName}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center">
                      <Coins className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <span className="truncate max-w-[140px] block">{transaction.propertyName}</span>
                    <span className="text-xs text-muted-foreground">ID: {transaction.propertyId.substring(0, 8)}...</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getTransactionIcon(transaction.type)}
                  <span className="capitalize font-medium">{transaction.type}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono">{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(transaction.status)}
                  {getStatusBadge(transaction.status)}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(transaction.date)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <span className={`font-medium ${
                  transaction.type === 'buy' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {transaction.type === 'buy' ? '-' : '+'}{formatCurrency(transaction.amount)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
