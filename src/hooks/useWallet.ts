import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { metaMaskConnector, coinbaseWalletConnector } from '@/lib/wallet-connectors';

export function useWallet() {
  const { account, isActive, connector, provider } = useWeb3React();
  const [balance, setBalance] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [pendingWallet, setPendingWallet] = useState<'metamask' | 'coinbase' | null>(null);
  const { toast } = useToast();

  // Connect to MetaMask
  const connectMetaMask = async () => {
    try {
      setConnectionError(null);
      setIsConnecting(true);
      setPendingWallet('metamask');
      
      console.log('Starting MetaMask connection...');
      
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
      }
      
      await metaMaskConnector.activate();
      
      console.log('MetaMask connection successful');
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
      
    } catch (error: any) {
      console.error("MetaMask connection error:", error);
      let errorMessage = "Failed to connect to MetaMask.";
      
      if (error.message) {
        if (error.message.includes("user rejected")) {
          errorMessage = "Connection rejected by user.";
        } else if (error.message.includes("not installed")) {
          errorMessage = "MetaMask is not installed. Please install MetaMask browser extension.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setConnectionError(errorMessage);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: errorMessage,
      });
    } finally {
      setIsConnecting(false);
      setPendingWallet(null);
    }
  };

  // Connect to Coinbase Wallet
  const connectCoinbase = async () => {
    try {
      setConnectionError(null);
      setIsConnecting(true);
      setPendingWallet('coinbase');
      
      console.log('Starting Coinbase Wallet connection...');
      
      await coinbaseWalletConnector.activate();
      
      console.log('Coinbase Wallet connection successful');
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Coinbase Wallet",
      });
      
    } catch (error: any) {
      console.error("Coinbase Wallet connection error:", error);
      let errorMessage = "Failed to connect to Coinbase Wallet.";
      
      if (error.message) {
        if (error.message.includes("user rejected")) {
          errorMessage = "Connection rejected by user.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setConnectionError(errorMessage);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: errorMessage,
      });
    } finally {
      setIsConnecting(false);
      setPendingWallet(null);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      if (connector) {
        if (connector.deactivate) {
          await connector.deactivate();
        } else {
          await connector.resetState();
        }
        setBalance(null);
        setConnectionError(null);
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected",
        });
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  // Copy address to clipboard
  const copyAddress = async () => {
    if (account) {
      try {
        await navigator.clipboard.writeText(account);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Address Copied",
          description: "Wallet address copied to clipboard",
        });
      } catch (error) {
        console.error("Failed to copy address:", error);
      }
    }
  };

  // Get account balance
  useEffect(() => {
    const getBalance = async () => {
      if (isActive && account && provider) {
        try {
          console.log('Fetching balance for account:', account);
          const balance = await provider.getBalance(account);
          const balanceInEth = ethers.formatEther(balance.toString());
          setBalance(balanceInEth);
          console.log('Balance fetched:', balanceInEth, 'ETH');
        } catch (error) {
          console.error("Error fetching balance:", error);
          setBalance(null);
        }
      } else {
        setBalance(null);
      }
    };

    getBalance();
  }, [isActive, account, provider]);

  // Clear errors when connection state changes
  useEffect(() => {
    if (isActive) {
      setConnectionError(null);
    }
  }, [isActive]);

  return {
    // Wallet connection status
    isConnected: isActive,
    address: account,
    balance,
    provider,
    
    // Connection methods
    connectMetaMask,
    connectCoinbase,
    disconnectWallet,
    
    // UI helpers
    copyAddress,
    copied,
    
    // Loading states
    connectionError,
    isConnecting,
    pendingWallet
  };
}