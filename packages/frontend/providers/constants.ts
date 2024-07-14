import { http, createConfig } from "@wagmi/core";
import { celoAlfajores, celo } from "@wagmi/core/chains";
import { createWalletClient, erc20Abi, custom, createPublicClient } from "viem";
import { celoAlfajores as vCeloAlfajores } from "viem/chains";
import { OdisContextName } from "@celo/identity/lib/odis/query";

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

export const config = createConfig({
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
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
