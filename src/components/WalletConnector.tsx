import React from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Wallet, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function WalletConnector() {
  const {
    isConnected,
    address,
    balance,
    connectMetaMask,
    connectCoinbase,
    disconnectWallet,
    copyAddress,
    copied,
    connectionError,
    isConnecting,
    pendingWallet
  } = useWallet();

  if (isConnected && address) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Address:</p>
            <div className="flex items-center gap-2">
              <code className="bg-muted px-2 py-1 rounded text-xs flex-1 truncate">
                {address}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copyAddress}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
          
          {balance && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Balance:</p>
              <Badge variant="secondary">
                {parseFloat(balance).toFixed(4)} ETH
              </Badge>
            </div>
          )}
          
          <Button 
            variant="destructive" 
            onClick={disconnectWallet}
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectionError && (
          <Alert variant="destructive">
            <AlertDescription>{connectionError}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-3">
          <Button
            onClick={connectMetaMask}
            disabled={isConnecting}
            className="w-full"
            variant="outline"
          >
            {isConnecting && pendingWallet === 'metamask' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask" 
                className="mr-2 h-4 w-4"
              />
            )}
            Connect MetaMask
          </Button>
          
          <Button
            onClick={connectCoinbase}
            disabled={isConnecting}
            className="w-full"
            variant="outline"
          >
            {isConnecting && pendingWallet === 'coinbase' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <div className="mr-2 h-4 w-4 bg-blue-600 rounded-full" />
            )}
            Connect Coinbase Wallet
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center mt-4">
          <p>Make sure you have MetaMask or Coinbase Wallet installed</p>
          <p>and connected to Mumbai Testnet</p>
        </div>
      </CardContent>
    </Card>
  );
}