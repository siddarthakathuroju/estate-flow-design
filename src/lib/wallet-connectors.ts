
import { MetaMask } from '@web3-react/metamask';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector } from '@web3-react/core';
import type { Connector } from '@web3-react/types';
import type { Web3ReactHooks } from '@web3-react/core';

// Initialize MetaMask connector
export const [metaMaskConnector, metaMaskHooks] = initializeConnector<MetaMask>((actions) => 
  new MetaMask({ 
    actions,
    options: {
      mustBeMetaMask: true,
    }
  })
);

// Initialize Coinbase Wallet connector
export const [coinbaseWalletConnector, coinbaseWalletHooks] = initializeConnector<CoinbaseWallet>((actions) =>
  new CoinbaseWallet({
    actions,
    options: {
      url: "https://polygon-mumbai.infura.io/v3/your-infura-id", // Mumbai testnet
      appName: "Real Estate DApp",
      appLogoUrl: undefined,
    }
  })
);

export const connectors: [Connector, Web3ReactHooks][] = [
  [metaMaskConnector, metaMaskHooks],
  [coinbaseWalletConnector, coinbaseWalletHooks]
];
