
import { toast } from "@/components/ui/use-toast";

// Define the Transaction type
export interface Transaction {
  id: string;
  userId: string;
  propertyId: string;
  propertyName: string;
  propertyImage?: string;
  type: 'buy' | 'sell';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

// Mock storage key
const TRANSACTIONS_STORAGE_KEY = 'nft_property_transactions';

// Get transactions from localStorage
export const getTransactions = (userId?: string): Transaction[] => {
  const transactionsData = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
  const transactions = transactionsData ? JSON.parse(transactionsData) : [];
  
  if (userId) {
    return transactions.filter((transaction: Transaction) => transaction.userId === userId);
  }
  
  return transactions;
};

// Save transactions to localStorage
const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
};

// Add a new transaction
export const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>): Transaction => {
  const transactions = getTransactions();
  
  const newTransaction: Transaction = {
    ...transaction,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  
  transactions.push(newTransaction);
  saveTransactions(transactions);
  
  const actionType = transaction.type === 'buy' ? 'purchased' : 'sold';
  
  toast({
    title: "Transaction Recorded",
    description: `You have ${actionType} ${transaction.propertyName}`,
  });
  
  return newTransaction;
};

// Get user's transaction history
export const getUserTransactionHistory = (userId: string): Transaction[] => {
  const transactions = getTransactions(userId);
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
