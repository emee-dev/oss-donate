"use client";

import { Toaster } from "@/components/ui/toaster";
import { useWeb3Context } from "@/context";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  WagmiProvider,
  createConfig,
  http,
  useAccount,
  useConnect,
} from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { injected } from "wagmi/connectors";

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
export const config = createConfig({
  connectors: connectors,
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});

// const config = createConfig({
//   connectors,
//   chains: [celo, celoAlfajores, hardhat],
//   transports: {
//     [celo.id]: http(),
//     [celoAlfajores.id]: http(),
//     [hardhat.id]: http(),
//   },
// });

const queryClient = new QueryClient();

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Web3Account>{children}</Web3Account>
        </RainbowKitProvider>
      </QueryClientProvider>
      <Toaster />
    </WagmiProvider>
  );
};

const Web3Account = ({ children }: { children: React.ReactNode }) => {
  let { address } = useAccount();
  let { setAccountAddress } = useWeb3Context();
  const { connect } = useConnect();

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  useEffect(() => {
    if (address) {
      setAccountAddress(address);
    }
  }, [address]);
  return <>{children}</>;
};

export default ClientProviders;
