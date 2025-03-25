
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

// Calculate portfolio summary from transactions
export const calculatePortfolioSummary = (userId: string): PortfolioSummary => {
  const transactions = getTransactions(userId);
  
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

