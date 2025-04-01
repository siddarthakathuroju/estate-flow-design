
import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useToast } from '@/components/ui/use-toast';
import { metaMaskConnector, coinbaseConnector } from '@/lib/wallet-connectors';

export function useWalletConnection() {
  const { account, isActive, connector, provider } = useWeb3React();
  const [balance, setBalance] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [pendingWallet, setPendingWallet] = useState<'metamask' | 'coinbase' | null>(null);
  const { toast } = useToast();

  // Connect to MetaMask
  const connectMetaMask = async () => {
    if (connector !== metaMaskConnector) {
      try {
        setConnectionError(null);
        setIsConnecting(true);
        setPendingWallet('metamask');
        
        // Check if MetaMask is installed
        const ethereum = window.ethereum;
        if (!ethereum || !ethereum.isMetaMask) {
          setConnectionError("MetaMask is not installed. Please install MetaMask to continue.");
          toast({
            variant: "destructive",
            title: "MetaMask Not Found",
            description: "Please install MetaMask browser extension to connect.",
          });
          setIsConnecting(false);
          setPendingWallet(null);
          return;
        }
        
        await metaMaskConnector.activate();
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to MetaMask",
        });
      } catch (error) {
        console.error("MetaMask connection error:", error);
        setConnectionError("Failed to connect to MetaMask. Please ensure it's installed and unlocked.");
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "Failed to connect to MetaMask. Please try again.",
        });
      } finally {
        setIsConnecting(false);
        setPendingWallet(null);
      }
    }
  };

  // Connect to Coinbase Wallet
  const connectCoinbaseWallet = async () => {
    if (connector !== coinbaseConnector) {
      try {
        setConnectionError(null);
        setIsConnecting(true);
        setPendingWallet('coinbase');
        
        // Activate Coinbase wallet connector
        await coinbaseConnector.activate();
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to Coinbase Wallet",
        });
      } catch (error) {
        console.error("Coinbase Wallet connection error:", error);
        
        // Check if error is due to user rejection
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        
        if (errorMessage.includes("User denied")) {
          setConnectionError("Connection rejected. Please approve the connection request in Coinbase Wallet.");
          toast({
            variant: "destructive",
            title: "Connection Rejected",
            description: "You declined the connection request in Coinbase Wallet.",
          });
        } else {
          setConnectionError("Failed to connect to Coinbase Wallet. Please ensure it's installed or try again.");
          toast({
            variant: "destructive",
            title: "Connection Failed",
            description: "Failed to connect to Coinbase Wallet. Please try again.",
          });
        }
      } finally {
        setIsConnecting(false);
        setPendingWallet(null);
      }
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    try {
      if (connector && connector.deactivate) {
        await connector.deactivate();
      } else {
        await connector.resetState();
      }
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  // Copy address to clipboard
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  // Get account balance
  useEffect(() => {
    const getBalance = async () => {
      if (isActive && account && provider) {
        try {
          const balance = await provider.getBalance(account);
          // Convert balance to string before passing to formatEther
          setBalance(ethers.formatEther(balance.toString()));
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
