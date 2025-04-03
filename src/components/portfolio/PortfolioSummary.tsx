
import { Wallet, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PortfolioSummaryProps {
  totalInvested: number;
  totalReturns: number;
  profit: number;
  profitPercentage: number;
  propertiesOwned: number;
  formatCurrency: (amount: number) => string;
  formatPercentage: (percentage: number) => string;
}

export function PortfolioSummary({ 
  totalInvested, 
  totalReturns, 
  profit, 
  profitPercentage, 
  propertiesOwned,
  formatCurrency,
  formatPercentage
}: PortfolioSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="shadow-md border border-border/50 bg-card/95 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Invested</p>
              <h2 className="text-2xl font-bold mt-1">
                {formatCurrency(totalInvested)}
              </h2>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md border border-border/50 bg-card/95 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Returns</p>
              <h2 className="text-2xl font-bold mt-1">
                {formatCurrency(totalReturns)}
              </h2>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md border border-border/50 bg-card/95 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Profit/Loss</p>
              <div className="flex items-center mt-1">
                <h2 className="text-2xl font-bold">
                  {formatCurrency(profit)}
                </h2>
                {profit !== 0 && (
                  <Badge className={`ml-2 ${profit > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {formatPercentage(profitPercentage)}
                  </Badge>
                )}
              </div>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              {profit >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-500" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md border border-border/50 bg-card/95 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Properties Owned</p>
              <h2 className="text-2xl font-bold mt-1">
                {propertiesOwned}
              </h2>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
