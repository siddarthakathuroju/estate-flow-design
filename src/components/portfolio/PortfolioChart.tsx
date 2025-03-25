
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  title: string;
  description?: string;
}

export function PortfolioChart({ data, title, description }: PortfolioChartProps) {
  // Calculate if we're in profit or loss by comparing first and last data points
  const isProfit = data.length >= 2 && data[data.length - 1].value > data[0].value;
  
  // Format dates for display
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'MMM dd')
  }));

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            {isProfit ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer 
            config={{
              profit: {
                theme: {
                  light: isProfit ? "#10b981" : "#ef4444",
                  dark: isProfit ? "#10b981" : "#ef4444",
                },
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formattedData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isProfit ? "#10b981" : "#ef4444"} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={isProfit ? "#10b981" : "#ef4444"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="formattedDate"
                  tickLine={false}
                  axisLine={false}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value.toFixed(4)} ETH`}
                  domain={['auto', 'auto']}
                  padding={{ top: 10, bottom: 10 }}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="font-medium">{payload[0].payload.formattedDate}</div>
                          <div className="text-xs text-muted-foreground">
                            {payload[0].value.toFixed(4)} ETH
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isProfit ? "#10b981" : "#ef4444"} 
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
