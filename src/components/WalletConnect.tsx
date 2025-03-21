
import { Web3ReactProvider } from '@web3-react/core';
import { useIsMobile } from '@/hooks/use-mobile';
import { connectors } from '@/lib/wallet-connectors';
import { MobileWalletConnect } from '@/components/wallet/MobileWalletConnect';
import { DesktopWalletConnect } from '@/components/wallet/DesktopWalletConnect';

// Main wallet connection component
export default function WalletConnect() {
  const isMobile = useIsMobile();
  
  return (
    <Web3ReactProvider connectors={connectors as any}>
      {isMobile ? <MobileWalletConnect /> : <DesktopWalletConnect />}
    </Web3ReactProvider>
  );
}

// Function for wallet connection that can be called anywhere in the app
export function ConnectWalletButton({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  
  return (
    <Web3ReactProvider connectors={connectors as any}>
      {isMobile ? <MobileWalletConnect /> : <DesktopWalletConnect />}
    </Web3ReactProvider>
  );
}
