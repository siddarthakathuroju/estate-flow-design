
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      <CardFooter className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="erc-standards">
            <AccordionTrigger className="flex items-center text-sm font-medium text-primary">
              <Info className="h-4 w-4 mr-2" />
              Ethereum Token Standards (ERC) Information
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4 mt-2">
                <div className="p-3 bg-slate-50 rounded-md">
                  <h3 className="font-medium text-sm mb-1">ERC-20</h3>
                  <p className="text-xs text-muted-foreground">The most common token standard for fungible tokens. Used for cryptocurrencies and utility tokens that are identical to each other.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-md">
                  <h3 className="font-medium text-sm mb-1">ERC-721</h3>
                  <p className="text-xs text-muted-foreground">The standard for non-fungible tokens (NFTs). Each token is unique and represents individual property deeds in our platform.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-md">
                  <h3 className="font-medium text-sm mb-1">ERC-1155</h3>
                  <p className="text-xs text-muted-foreground">Multi-token standard that allows for both fungible and non-fungible tokens in a single contract. Useful for fractional property ownership.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-md">
                  <h3 className="font-medium text-sm mb-1">ERC-4907</h3>
                  <p className="text-xs text-muted-foreground">Rental standard extension for NFTs, enabling temporary usage rights while maintaining ownership. Perfect for property rental agreements.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-md">
                  <h3 className="font-medium text-sm mb-1">ERC-2981</h3>
                  <p className="text-xs text-muted-foreground">Royalty standard that ensures original property developers receive a percentage of secondary sales automatically.</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}
