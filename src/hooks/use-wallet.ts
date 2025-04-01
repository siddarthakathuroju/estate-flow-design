
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
        let errorMessage = "Failed to connect to MetaMask.";
        
        if (error instanceof Error) {
          if (error.message.includes("user rejected")) {
            errorMessage = "You rejected the connection request.";
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
        let errorMessage = "Failed to connect to Coinbase Wallet.";
        
        if (error instanceof Error) {
          if (error.message.includes("User denied")) {
            errorMessage = "You declined the connection request in Coinbase Wallet.";
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
    }
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
