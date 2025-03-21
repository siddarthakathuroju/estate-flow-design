
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
  const { toast } = useToast();

  // Connect to MetaMask
  const connectMetaMask = async () => {
    if (connector !== metaMaskConnector) {
      try {
        setConnectionError(null);
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
      }
    }
  };

  // Connect to Coinbase Wallet
  const connectCoinbaseWallet = async () => {
    if (connector !== coinbaseConnector) {
      try {
        setConnectionError(null);
        await coinbaseConnector.activate();
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to Coinbase Wallet",
        });
      } catch (error) {
        console.error("Coinbase Wallet connection error:", error);
        setConnectionError("Failed to connect to Coinbase Wallet. Please ensure it's installed.");
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "Failed to connect to Coinbase Wallet. Please try again.",
        });
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
    connectionError
  };
}
