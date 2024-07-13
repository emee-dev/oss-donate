import { Contract, ethers } from "ethers";
import { registryABI } from "@celo/abis";
import { OdisContextName } from "@celo/identity/lib/odis/query";
import { createPublicClient, http, parseEther } from "viem";
import { mainnet } from "viem/chains";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// export const FA_CONTRACT = import("@/abis/FederatedAttestations.json");
// export const ODIS_PAYMENTS_CONTRACT = import("@/abis/OdisPayments.json");
// export const STABLE_TOKEN_CONTRACT = import("@/abis/StableToken.json");

// export const ISSUER_PRIVATE_KEY = process.env.NEXT_PUBLIC_ISSUER_PRIVATE_KEY;
// export const DEK_PRIVATE_KEY = process.env.NEXT_PUBLIC_DEK_PRIVATE_KEY;

export const FA_PROXY_ADDRESS =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "TESTNET"
    ? "0x70F9314aF173c246669cFb0EEe79F9Cfd9C34ee3"
    : "0x0aD5b1d0C25ecF6266Dd951403723B2687d6aff2";

// export const ESCROW_PROXY_ADDRESS =
//   process.env.NEXT_PUBLIC_ENVIRONMENT === "TESTNET"
//     ? "0xf4Fa51472Ca8d72AF678975D9F8795A504E7ada5"
//     : "0xb07E10c5837c282209c6B9B3DE0eDBeF16319a37";

export const ODIS_PAYMENTS_PROXY_ADDRESS =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "TESTNET"
    ? "0x645170cdB6B5c1bc80847bb728dBa56C50a20a49"
    : "0xae6b29f31b96e61dddc792f45fda4e4f0356d0cb";

export const STABLE_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "TESTNET"
    ? "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
    : "0x765DE816845861e75A25fCA122bb6898B8B1282a";

export const ACCOUNTS_PROXY_ADDRESS =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "TESTNET"
    ? "0xed7f51A34B4e71fbE69B3091FcF879cD14bD73A9"
    : "0x7d21685C17607338b313a7174bAb6620baD0aaB7";

// 1 Credit = 0.001 cUSD
export const ONE_CENT_CUSD = parseEther("0.01");

export const NOW_TIMESTAMP = Math.floor(new Date().getTime() / 1000);

export const RPC =
  process.env.ENVIRONMENT === "TESTNET"
    ? "https://alfajores-forno.celo-testnet.org"
    : "https://forno.celo.org";

export const SERVICE_CONTEXT =
  process.env.ENVIRONMENT === "TESTNET"
    ? OdisContextName.ALFAJORES
    : OdisContextName.MAINNET;

export const provider = new ethers.providers.JsonRpcProvider(RPC);

export async function getCoreContractAddress(contractName: any) {
  const registryContract = new Contract(
    "0x000000000000000000000000000000000000ce10",
    registryABI,
    provider
  );

  return await registryContract.getAddressForStringOrDie(contractName);
}
