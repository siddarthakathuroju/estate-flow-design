
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileWalletConnect } from '@/components/wallet/MobileWalletConnect';
import { DesktopWalletConnect } from '@/components/wallet/DesktopWalletConnect';
import { Button } from "@/components/ui/button";
import { useWalletConnection } from '@/hooks/use-wallet';
import { Wallet, Coins } from 'lucide-react';

// Main wallet connection component
export default function WalletConnect({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  const { isActive, account, balance } = useWalletConnection();
  
  // If wallet is already connected, show a minimal wallet info display
  if (isActive && account) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="text-xs font-medium hidden sm:block">
          <div className="flex items-center">
            <Wallet className="h-3 w-3 mr-1 text-primary" />
            <span>{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
          </div>
          {balance && (
            <div className="flex items-center text-muted-foreground">
              <Coins className="h-3 w-3 mr-1" />
              <span>{parseFloat(balance).toFixed(4)} ETH</span>
            </div>
          )}
        </div>
        <Button size="sm" variant="outline" className="h-8 px-2 py-1">
          <Wallet className="h-3 w-3 sm:mr-1" />
          <span className="hidden sm:inline">Connected</span>
        </Button>
      </div>
    );
  }
  
  return (
    <div className={className}>
      {isMobile ? <MobileWalletConnect /> : <DesktopWalletConnect />}
    </div>
  );
}

// Function for wallet connection that can be called anywhere in the app
export function ConnectWalletButton({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  const { isActive, account, balance } = useWalletConnection();
  
  // If wallet is already connected, show a minimal wallet info button
  if (isActive && account) {
    return (
      <Button variant="outline" className={className}>
        <Wallet className="h-4 w-4 mr-2" />
        <span>
          {account.substring(0, 6)}...{account.substring(account.length - 4)}
        </span>
      </Button>
    );
  }
  
  return (
    <div className={className}>
      {isMobile ? <MobileWalletConnect /> : <DesktopWalletConnect />}
    </div>
  );
}
