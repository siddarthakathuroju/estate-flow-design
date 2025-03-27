
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileWalletConnect } from '@/components/wallet/MobileWalletConnect';
import { DesktopWalletConnect } from '@/components/wallet/DesktopWalletConnect';

// Main wallet connection component
export default function WalletConnect({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  
  return (
    <>
      {isMobile ? <MobileWalletConnect /> : <DesktopWalletConnect />}
    </>
  );
}

// Function for wallet connection that can be called anywhere in the app
export function ConnectWalletButton({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  
  return (
    <>
      {isMobile ? <MobileWalletConnect /> : <DesktopWalletConnect />}
    </>
  );
}
