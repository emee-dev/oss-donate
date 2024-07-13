"use client";

import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createPublicClient } from "viem";
import { WagmiProvider, createConfig, http } from "wagmi";
import { celo, celoAlfajores, hardhat } from "wagmi/chains";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [injectedWallet],
    },
  ],
  {
    appName: "OSSDonate",
    projectId: "044601f65212332475a09bc14ceb3c34",
  }
);

export const publicClient = createPublicClient({
  // chain: celo,
  chain: hardhat,
  transport: http(),
});

const config = createConfig({
  connectors,
  chains: [celo, celoAlfajores, hardhat],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
    [hardhat.id]: http(),
  },
});

const queryClient = new QueryClient();

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default ClientProviders;
