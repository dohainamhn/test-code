import { chain, defaultChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WalletLinkConnector } from "wagmi/connectors/walletLink";

// API key for Ethereum node
// Two popular services are Infura (infura.io) and Alchemy (alchemy.com)
const infuraId = '3a8742e05a97452dac21c904f59270cd';

// Chains for connectors to support
const chains = defaultChains;

// Set up connectors
export const connectors = ({ chainId }) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0];
  return [
    new WalletLinkConnector({
      options: {
        appName: "My wagmi app",
        jsonRpcUrl: `${rpcUrl}/${infuraId}`
      }
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true
      }
    }),
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true }
    })
  ];
};
