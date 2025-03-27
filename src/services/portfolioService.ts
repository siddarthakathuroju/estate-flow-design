
import { Transaction, getTransactions } from "./transactionService";

// Portfolio summary type
export interface PortfolioSummary {
  totalInvested: number;
  totalReturns: number;
  profit: number;
  profitPercentage: number;
  propertiesOwned: number;
  totalTransactions: number;
}

// Property with profit calculation
export interface PropertyWithProfit {
  id: string;
  name: string;
  image?: string;
  invested: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
}

// Portfolio chart data point
export interface PortfolioChartData {
  date: string;
  value: number;
}

// Calculate portfolio summary from transactions
export const calculatePortfolioSummary = (userId: string): PortfolioSummary => {
  const transactions = getTransactions(userId);
  
  // If no transactions yet, return default values
  if (transactions.length === 0) {
    return {
      totalInvested: 0,
      totalReturns: 0,
      profit: 0,
      profitPercentage: 0,
      propertiesOwned: 0,
      totalTransactions: 0
    };
  }
  
  // Calculate total invested (buy transactions)
  const buyTransactions = transactions.filter(t => t.type === 'buy');
  const totalInvested = buyTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate total returns (sell transactions)
  const sellTransactions = transactions.filter(t => t.type === 'sell');
  const totalReturns = sellTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate profit
  const profit = totalReturns - totalInvested;
  const profitPercentage = totalInvested > 0 
    ? (profit / totalInvested) * 100 
    : 0;
  
  // Count unique properties owned (bought but not sold)
  const boughtPropertyIds = new Set(buyTransactions.map(t => t.propertyId));
  const soldPropertyIds = new Set(sellTransactions.map(t => t.propertyId));
  
  // Properties still owned are those bought but not sold
  const ownedPropertyIds = new Set(
    [...boughtPropertyIds].filter(id => !soldPropertyIds.has(id))
  );
  
  return {
    totalInvested,
    totalReturns,
    profit,
    profitPercentage,
    propertiesOwned: ownedPropertyIds.size,
    totalTransactions: transactions.length
  };
};

// Get property performance with profit calculation
export const getPropertyPerformance = (userId: string): PropertyWithProfit[] => {
  const transactions = getTransactions(userId);
  const propertyMap = new Map<string, PropertyWithProfit>();
  
  // If no transactions yet, return empty array
  if (transactions.length === 0) {
    return [];
  }
  
  // Process all transactions to calculate property performance
  transactions.forEach(transaction => {
    const { propertyId, propertyName, propertyImage, type, amount } = transaction;
    
    if (!propertyMap.has(propertyId)) {
      propertyMap.set(propertyId, {
        id: propertyId,
        name: propertyName,
        image: propertyImage,
        invested: 0,
        currentValue: 0,
        profit: 0,
        profitPercentage: 0
      });
    }
    
    const property = propertyMap.get(propertyId)!;
    
    if (type === 'buy') {
      property.invested += amount;
      property.currentValue += amount; // Assume current value is same as invested for unsold properties
    } else if (type === 'sell') {
      property.currentValue -= amount;
      property.profit += amount - (property.invested / (property.currentValue + amount)) * amount;
    }
    
    // Recalculate profit percentage
    property.profitPercentage = property.invested > 0 
      ? (property.profit / property.invested) * 100 
      : 0;
  });
  
  return Array.from(propertyMap.values());
};

// Generate portfolio value chart data
export const getPortfolioChartData = (userId: string): PortfolioChartData[] => {
  const transactions = getTransactions(userId);
  
  // If no transactions yet, return default data points for an empty chart
  if (transactions.length === 0) {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    return [
      { date: thirtyDaysAgo.toISOString(), value: 0 },
      { date: today.toISOString(), value: 0 }
    ];
  }
  
  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Create a map to track portfolio value over time
  const portfolioValueMap = new Map<string, number>();
  let runningValue = 0;
  
  // Process each transaction to calculate cumulative portfolio value
  sortedTransactions.forEach(transaction => {
    if (transaction.type === 'buy') {
      runningValue += transaction.amount;
    } else if (transaction.type === 'sell') {
      runningValue -= transaction.amount * 0.8; // Simulating that we sell at profit
      runningValue += transaction.amount;
    }
    
    // Store the portfolio value at this date
    const dateKey = new Date(transaction.date).toISOString().split('T')[0];
    portfolioValueMap.set(dateKey, runningValue);
  });
  
  // Convert map to array of data points for the chart
  const chartData: PortfolioChartData[] = Array.from(portfolioValueMap.entries())
    .map(([date, value]) => ({
      date: new Date(date).toISOString(),
      value
    }));
  
  // Ensure we have at least two data points for the chart
  if (chartData.length === 1) {
    // If only one data point, add another point for today
    chartData.push({
      date: new Date().toISOString(),
      value: chartData[0].value
    });
  }
  
  return chartData;
};
