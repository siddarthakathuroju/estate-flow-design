
import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { metaMaskConnector } from '@/lib/wallet-connectors';

export function useWalletConnection() {
  const { account, isActive, connector, provider } = useWeb3React();
  const [balance, setBalance] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [pendingWallet, setPendingWallet] = useState<'metamask' | null>(null);
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
      
      // Check if MetaMask is the active connector
      if (connector !== metaMaskConnector) {
        console.log('Activating MetaMask connector...');
        await metaMaskConnector.activate();
      }
      
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

  // Placeholder for Coinbase Wallet - we'll add this back later
  const connectCoinbaseWallet = async () => {
    setConnectionError("Coinbase Wallet support coming soon!");
    toast({
      variant: "destructive",
      title: "Not Available",
      description: "Coinbase Wallet support is coming soon. Please use MetaMask for now.",
    });
  };

  // Disconnect wallet
  const disconnect = async () => {
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
    account,
    isActive,
    balance,
    copied,
    connectMetaMask,
    connectCoinbaseWallet,
    disconnect,
    copyAddress,
    connectionError,
    isConnecting,
    pendingWallet
  };
}
