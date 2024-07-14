import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
// import { createConfig, http } from "@wagmi/core";
import { createConfig, http } from "wagmi";
import { celo, celoAlfajores } from "@wagmi/core/chains";
import { createPublicClient, createWalletClient, custom } from "viem";
import { celoAlfajores as vCeloAlfajores } from "viem/chains";
import { hardhat } from "wagmi/chains";

export const MGCADDRESS = process.env
  .NEXT_PUBLIC_GIFT_CARD_ADDRESS as `0x${string}`;

export const walletClient = createWalletClient({
  chain: vCeloAlfajores,
  transport: typeof window !== "undefined" ? custom(window.ethereum) : http(),
});

export const publicClient = createPublicClient({
  chain: vCeloAlfajores,
  transport: http(),
});
// export const publicClient = createPublicClient({
//   chain: celo,
//   transport: http(),
// }); // Mainnet

// export const config = createConfig({
//   chains: [celo, celoAlfajores],
//   transports: {
//     [celo.id]: http(),
//     [celoAlfajores.id]: http(),
//   },
// });

export const connectors = connectorsForWallets(
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
  chains: [celo, celoAlfajores, hardhat],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
    [hardhat.id]: http(),
  },
});

export const RPC =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "TESTNET"
    ? "https://alfajores-forno.celo-testnet.org"
    : "https://forno.celo.org";

export const STABLE_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "TESTNET"
    ? "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
    : "0x765DE816845861e75A25fCA122bb6898B8B1282a";

export const tempJson = {
  ossdonate: {
    celo: {
      ownedBy: "0x0000000000000000000000000000000000000000",
    },
  },
};
