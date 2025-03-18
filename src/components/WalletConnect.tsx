
import { useState, useEffect } from 'react';
import { Web3ReactProvider, useWeb3React, initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { ethers } from 'ethers';
import { 
  Wallet, 
  LogIn, 
  LogOut, 
  UserCheck, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Coins 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Initialize connectors
const [metaMaskConnector, metaMaskHooks] = initializeConnector(actions => 
  new MetaMask({ actions })
);

// Initialize Coinbase Wallet connector
const [coinbaseConnector, coinbaseHooks] = initializeConnector(actions => 
  new CoinbaseWallet({
    actions,
    options: {
      appName: 'NFT Property Exchange',
      // Use the correct property name according to CoinbaseWallet's API
      url: 'https://mainnet.infura.io/v3/your-infura-id', // Will be replaced by user input
    }
  })
);

const connectors = [
  [metaMaskConnector, metaMaskHooks],
  [coinbaseConnector, coinbaseHooks]
];

// Wallet connection hook
function useWalletConnection() {
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
          // Using ethers v6 BrowserProvider instead of Web3Provider
          const balance = await provider.getBalance(account);
          setBalance(ethers.formatEther(balance));
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

// Mobile Drawer for wallet connection
function MobileWalletConnect() {
  const {
    account,
    isActive,
    balance,
    copied,
    connectMetaMask,
    connectCoinbaseWallet,
    disconnect,
    copyAddress,
    connectionError
  } = useWalletConnection();
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="relative">
          <Wallet className="mr-2" />
          {isActive ? 'Connected' : 'Connect Wallet'}
          {isActive && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{isActive ? 'Wallet Connected' : 'Connect Wallet'}</DrawerTitle>
          <DrawerDescription>
            {isActive 
              ? 'You are connected to the blockchain' 
              : 'Connect your wallet to access the NFT marketplace'}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          {connectionError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{connectionError}</p>
            </div>
          )}
          
          {isActive ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCheck className="text-green-500" size={20} />
                  <div className="text-sm">
                    <p className="font-medium">Connected Account</p>
                    <p className="text-muted-foreground break-all">
                      {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 gap-1"
                  onClick={copyAddress}
                >
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Coins className="text-purple-500" size={20} />
                  <div className="text-sm">
                    <p className="font-medium">Balance</p>
                    <p className="text-muted-foreground">
                      {balance ? `${parseFloat(balance).toFixed(4)} ETH` : 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full gap-2" 
                onClick={disconnect}
              >
                <LogOut size={16} />
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-2">
                Choose your preferred wallet to connect:
              </p>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 h-12" 
                onClick={connectMetaMask}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                  alt="MetaMask" 
                  className="w-6 h-6" 
                />
                MetaMask
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 h-12" 
                onClick={connectCoinbaseWallet}
              >
                <img 
                  src="https://altcoinsbox.com/wp-content/uploads/2023/01/coinbase-wallet-logo.svg" 
                  alt="Coinbase Wallet" 
                  className="w-6 h-6" 
                />
                Coinbase Wallet
              </Button>
            </div>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// Desktop Dialog for wallet connection
function DesktopWalletConnect() {
  const {
    account,
    isActive,
    balance,
    copied,
    connectMetaMask,
    connectCoinbaseWallet,
    disconnect,
    copyAddress,
    connectionError
  } = useWalletConnection();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Wallet className="mr-2" />
          {isActive ? 'Connected' : 'Connect Wallet'}
          {isActive && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isActive ? 'Wallet Connected' : 'Connect Wallet'}</DialogTitle>
          <DialogDescription>
            {isActive 
              ? 'You are connected to the blockchain' 
              : 'Connect your wallet to access the NFT marketplace'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-1">
          {connectionError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{connectionError}</p>
            </div>
          )}
          
          {isActive ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCheck className="text-green-500" size={20} />
                  <div className="text-sm">
                    <p className="font-medium">Connected Account</p>
                    <p className="text-muted-foreground font-mono break-all">
                      {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 gap-1"
                  onClick={copyAddress}
                >
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Coins className="text-purple-500" size={20} />
                  <div className="text-sm">
                    <p className="font-medium">Balance</p>
                    <p className="text-muted-foreground">
                      {balance ? `${parseFloat(balance).toFixed(4)} ETH` : 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full gap-2" 
                onClick={disconnect}
              >
                <LogOut size={16} />
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-2">
                Choose your preferred wallet to connect:
              </p>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 h-12" 
                onClick={connectMetaMask}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                  alt="MetaMask" 
                  className="w-6 h-6" 
                />
                MetaMask
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 h-12" 
                onClick={connectCoinbaseWallet}
              >
                <img 
                  src="https://altcoinsbox.com/wp-content/uploads/2023/01/coinbase-wallet-logo.svg" 
                  alt="Coinbase Wallet" 
                  className="w-6 h-6" 
                />
                Coinbase Wallet
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main wallet connection component
export default function WalletConnect() {
  const isMobile = useIsMobile();
  
  return (
    <Web3ReactProvider connectors={connectors}>
      {isMobile ? <MobileWalletConnect /> : <DesktopWalletConnect />}
    </Web3ReactProvider>
  );
}

// Function for wallet connection that can be called anywhere in the app
export function ConnectWalletButton({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  
  return (
    <Web3ReactProvider connectors={connectors}>
      {isMobile ? <MobileWalletConnect /> : <DesktopWalletConnect />}
    </Web3ReactProvider>
  );
}
