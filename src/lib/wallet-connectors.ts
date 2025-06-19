
import { MetaMask } from '@web3-react/metamask';
import { initializeConnector } from '@web3-react/core';
import type { Connector } from '@web3-react/types';
import type { Web3ReactHooks } from '@web3-react/core';

// Initialize MetaMask connector with proper configuration
export const [metaMaskConnector, metaMaskHooks] = initializeConnector<MetaMask>((actions) => 
  new MetaMask({ 
    actions,
    options: {
      mustBeMetaMask: true,
    }
  })
);

// For now, let's just export MetaMask to avoid Coinbase Wallet SDK issues
// We can add other connectors later once the main app is working
export const connectors: [Connector, Web3ReactHooks][] = [
  [metaMaskConnector, metaMaskHooks]
];
