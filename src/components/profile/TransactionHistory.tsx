
import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, AlertCircle, Coins, Filter } from 'lucide-react';
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
  
  // Get transaction history
  const transactions = user ? getUserTransactionHistory(user.id) : [];
  
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your property buying and selling activity</CardDescription>
          </div>
          <Collapsible
            open={isFiltersOpen}
            onOpenChange={setIsFiltersOpen}
            className="w-auto"
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute right-0 mt-2 z-10 bg-white shadow-md rounded-md p-4 border w-[200px]">
              <div className="space-y-2">
                <div className="font-medium">Filter by:</div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Buy</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Sell</span>
                  </label>
                </div>
                <div className="font-medium mt-3">Status:</div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Completed</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Pending</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Failed</span>
                  </label>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="buy">Purchases</TabsTrigger>
            <TabsTrigger value="sell">Sales</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {renderTransactionsTable(transactions, {
              formatCurrency,
              getTransactionIcon,
              getStatusIcon,
              getStatusBadge,
              formatDate
            })}
          </TabsContent>
          
          <TabsContent value="buy" className="mt-0">
            {renderTransactionsTable(
              transactions.filter(t => t.type === 'buy'),
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
              transactions.filter(t => t.type === 'sell'),
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
            <TableHead className="text-right">Date</TableHead>
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
                  <span className="truncate max-w-[140px]">{transaction.propertyName}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getTransactionIcon(transaction.type)}
                  <span className="capitalize">{transaction.type}</span>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(transaction.status)}
                  {getStatusBadge(transaction.status)}
                </div>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDate(transaction.date)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
