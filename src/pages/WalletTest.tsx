import React from 'react';
import { WalletConnector } from '@/components/WalletConnector';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function WalletTest() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Wallet Connection Test</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Test MetaMask and Coinbase Wallet connectivity for the Real Estate NFT platform. 
              Make sure you have Mumbai Testnet configured for testing.
            </p>
          </div>

          {/* Setup Instructions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="outline">1</Badge>
                    Install MetaMask
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Download and install the MetaMask browser extension from metamask.io
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="outline">2</Badge>
                    Add Mumbai Testnet
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Network Name:</strong> Polygon Mumbai</p>
                    <p><strong>RPC URL:</strong> https://rpc-mumbai.maticvigil.com/</p>
                    <p><strong>Chain ID:</strong> 80001</p>
                    <p><strong>Currency:</strong> MATIC</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="outline">3</Badge>
                    Get Test MATIC
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get free test MATIC from the Mumbai faucet: faucet.polygon.technology
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="outline">4</Badge>
                    Test Connection
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use the wallet connector below to test the connection
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testing Checklist */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Testing Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    MetaMask connection works
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Coinbase Wallet connection works
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Wallet address displays correctly
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Balance shows in ETH/MATIC
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Disconnect functionality works
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Error handling works properly
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Connector Component */}
          <div className="flex justify-center mb-8">
            <WalletConnector />
          </div>

          {/* Next Steps */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Next Phase:</strong> Once wallet connectivity is working properly, we'll proceed to Phase 2: 
              Smart Contract Development and Deployment for real estate tokenization.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}