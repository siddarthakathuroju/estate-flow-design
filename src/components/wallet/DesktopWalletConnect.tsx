
import { useState } from 'react';
import { Wallet, LogIn, LogOut, UserCheck, Copy, CheckCircle, AlertCircle, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWalletConnection } from '@/hooks/use-wallet';

export function DesktopWalletConnect() {
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
