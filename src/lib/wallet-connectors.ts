
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
      // For Coinbase Wallet connector, we need to use 'initializationOptions' for chain config
      // or simply not specify any chain ID to default to Ethereum mainnet
    }
  })
);

// Format connectors for Web3ReactProvider
export const connectors: [MetaMask | CoinbaseWallet, typeof metaMaskHooks | typeof coinbaseHooks][] = [
  [metaMaskConnector, metaMaskHooks],
  [coinbaseConnector, coinbaseHooks]
];
