
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfitLossDisplayProps {
  profit: number;
  profitPercentage: number;
  formatCurrency: (amount: number) => string;
  formatPercentage: (percentage: number) => string;
}

export function ProfitLossDisplay({ 
  profit, 
  profitPercentage, 
  formatCurrency, 
  formatPercentage 
}: ProfitLossDisplayProps) {
  const isProfit = profit >= 0;
  const colorClass = isProfit ? 'text-green-500' : 'text-red-500';
  const bgColorClass = isProfit ? 'bg-green-50' : 'bg-red-50';
  const Icon = isProfit ? TrendingUp : TrendingDown;
  const ArrowIcon = isProfit ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="shadow-md border border-border/50 mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg md:text-xl">Portfolio Performance</CardTitle>
            <CardDescription>Summary of your profit and loss</CardDescription>
          </div>
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon className={`h-5 w-5 ${colorClass}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start space-y-2">
          <div className={`w-full rounded-lg ${bgColorClass} p-4 flex justify-between`}>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Profit/Loss</p>
              <p className={`text-xl md:text-2xl font-bold ${colorClass}`}>
                {formatCurrency(profit)}
              </p>
            </div>
            <div className="flex items-center">
              <ArrowIcon className={`h-5 w-5 ${colorClass}`} />
              <span className={`text-lg font-semibold ${colorClass}`}>
                {formatPercentage(profitPercentage)}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {isProfit 
              ? "Your investments are performing well. Consider reinvesting your profits for greater returns."
              : "Your portfolio is currently at a loss. Consider diversifying your investments or holding for long-term growth."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
