
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
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

  // Function to safely format value as number with decimal places
  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toFixed(4);
    }
    return String(value);
  };

  // Define chart config for the ChartContainer
  const chartConfig = {
    value: {
      label: 'Portfolio Value',
      color: isProfit ? '#10b981' : '#ef4444'
    }
  };

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
        {/* Adjusted height from 300px to 240px for better fit */}
        <div className="h-[240px] w-full">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formattedData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isProfit ? "#10b981" : "#ef4444"} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={isProfit ? "#10b981" : "#ef4444"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                {/* X-Axis with smaller font and reduced padding */}
                <XAxis 
                  dataKey="formattedDate"
                  tickLine={false}
                  axisLine={false}
                  padding={{ left: 5, right: 5 }}
                  tick={{ fontSize: 12 }}
                />
                {/* Y-Axis with simplified labels and controlled width */}
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${formatValue(value)}`}
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 11 }}
                  width={55}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const value = payload[0].value;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="font-medium">{payload[0].payload.formattedDate}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatValue(value)} ETH
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Area with increased stroke width for better visibility */}
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isProfit ? "#10b981" : "#ef4444"} 
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
