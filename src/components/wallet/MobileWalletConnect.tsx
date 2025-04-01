import { useState } from 'react';
import { Wallet, LogIn, LogOut, UserCheck, Copy, CheckCircle, AlertCircle, Coins, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useWalletConnection } from '@/hooks/use-wallet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export function MobileWalletConnect() {
  const {
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
  } = useWalletConnection();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("connect");
  const [manualAddress, setManualAddress] = useState("");

  // Handle connecting to MetaMask
  const handleMetaMaskConnect = () => {
    setActiveTab("connecting");
    connectMetaMask();
  };

  // Handle connecting to Coinbase Wallet
  const handleCoinbaseConnect = () => {
    setActiveTab("connecting");
    connectCoinbaseWallet();
  };

  // Function to open Coinbase Wallet app store page
  const openCoinbaseWalletDownload = () => {
    window.open("https://www.coinbase.com/wallet/downloads", "_blank");
  };

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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="connect">Connect Wallet</TabsTrigger>
                <TabsTrigger value="manual">Enter Address</TabsTrigger>
              </TabsList>
              
              <TabsContent value="connect" className="space-y-3">
                <p className="text-sm text-muted-foreground mb-2">
                  Choose your preferred wallet to connect:
                </p>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 h-12" 
                  onClick={handleMetaMaskConnect}
                  disabled={isConnecting}
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
                  onClick={handleCoinbaseConnect}
                  disabled={isConnecting}
                >
                  <img 
                    src="https://altcoinsbox.com/wp-content/uploads/2023/01/coinbase-wallet-logo.svg" 
                    alt="Coinbase Wallet" 
                    className="w-6 h-6" 
                  />
                  Coinbase Wallet
                </Button>
                
                <div className="text-xs text-muted-foreground pt-2 mt-2 border-t">
                  <p className="mb-1">Don't have a wallet?</p>
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-xs flex items-center" 
                    onClick={openCoinbaseWalletDownload}
                  >
                    Download Coinbase Wallet <ExternalLink size={10} className="ml-1" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enter your wallet address manually to view your assets.
                  </p>
                  <Input 
                    placeholder="0x..." 
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    className="mb-3 font-mono"
                  />
                  <Button 
                    className="w-full"
                    disabled={!manualAddress || manualAddress.length < 10}
                  >
                    Connect to Address <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <p className="mb-1">Note: Manual connection only allows viewing. For full functionality:</p>
                  <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setActiveTab("connect")}>
                    Connect with a wallet provider
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="connecting" className="py-4">
                <div className="text-center space-y-4">
                  <div className="animate-pulse">
                    <div className="relative mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      {pendingWallet === 'metamask' ? (
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                          alt="MetaMask" 
                          className="h-10 w-10" 
                        />
                      ) : (
                        <img 
                          src="https://altcoinsbox.com/wp-content/uploads/2023/01/coinbase-wallet-logo.svg" 
                          alt="Coinbase Wallet" 
                          className="h-10 w-10" 
                        />
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">Waiting for connection...</h3>
                  <p className="text-sm text-muted-foreground">
                    {pendingWallet === 'metamask' 
                      ? 'Please check MetaMask extension popup to approve the connection'
                      : 'Please check Coinbase Wallet extension popup to approve the connection'
                    }
                  </p>
                  
                  <div className="bg-muted/50 rounded-lg p-3 mt-4 text-left text-sm space-y-2">
                    <p className="text-xs font-medium">Don't see the popup?</p>
                    <ul className="list-disc text-xs text-muted-foreground pl-4 space-y-1">
                      <li>Check if the wallet extension is installed</li>
                      <li>Look for the wallet icon in your browser toolbar</li>
                      <li>Make sure your wallet is unlocked</li>
                    </ul>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="mt-2" 
                    onClick={() => setActiveTab("connect")}
                  >
                    Go Back
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
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
