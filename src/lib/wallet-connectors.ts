
import { MetaMask } from '@web3-react/metamask';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector } from '@web3-react/core';

// Initialize MetaMask connector
export const [metaMaskConnector, metaMaskHooks] = initializeConnector<MetaMask>((actions) => 
  new MetaMask({ actions })
);

// Initialize Coinbase Wallet connector with proper configuration
export const [coinbaseConnector, coinbaseHooks] = initializeConnector<CoinbaseWallet>((actions) => 
  new CoinbaseWallet({
    actions,
    options: {
      appName: 'NFT Property Exchange',
      // Use proper URL for Ethereum mainnet
      url: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', // Public Infura ID
    }
  })
);

// Create a mutable array of connectors for Web3ReactProvider
// This fixes the TypeScript error with readonly arrays
export const connectors = [
  [metaMaskConnector, metaMaskHooks],
  [coinbaseConnector, coinbaseHooks]
];
