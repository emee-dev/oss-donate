import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { createConfig as ccreateConfig } from "@wagmi/core";
// import { createConfig, http } from "wagmi";
import { createConfig, http } from "@wagmi/core";
import { celo, celoAlfajores, localhost } from "@wagmi/core/chains";
import {
  createPublicClient,
  createWalletClient,
  custom,
  formatEther,
  getContract,
  parseEther,
} from "viem";
import { celoAlfajores as vCeloAlfajores } from "viem/chains";
import { hardhat } from "wagmi/chains";
import { privateKeyToAccount } from "viem/accounts";
import { stableTokenABI } from "@celo/abis";
import { Web3Account } from "@/context/useAccount";

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

// TODO remember to add the mainnet address here
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "TESTNET"
    ? "0x9Ea6f574f06dF5C90d89447f1D7C623194AddaE3"
    : "0x9Ea6f574f06dF5C90d89447f1D7C623194AddaE3";

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

export async function checkCUSDBalance(
  client: typeof publicClient,
  address: `0x${string}`
) {
  let StableTokenContract = getContract({
    abi: stableTokenABI,
    address: STABLE_TOKEN_ADDRESS,
    client: client,
  });

  let balanceInBigNumber = await StableTokenContract.read.balanceOf([address]);

  let balanceInWei = balanceInBigNumber.toString();

  // @ts-expect-error
  let balanceInEthers = formatEther(balanceInWei);

  return balanceInEthers;
}

type Transaction = {
  account: "0x${string}";
  to: "0x${string}";
  value?: bigint;
  data: "0x${string}";
  stable_token_address: "0x${string}";
};

export async function estimateGas(
  client: typeof publicClient,
  transaction: Transaction
) {
  return await client.estimateGas({
    to: transaction.to,
    data: transaction.data,
    value: transaction.value,
    account: transaction.account,
    feeCurrency: transaction.stable_token_address || undefined,
  });
}

export const getGasPrice = async () => {
  return await publicClient.getGasPrice();
};

export const transactionReciept = (hash: `0x${string}`) => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "TESTNET") {
    return `https://alfajores.celoscan.io/tx/${hash}`;
  } else {
    return `https://celoscan.io/tx/${hash}`;
  }
};

export async function calculateTransactionCost(
  client: typeof publicClient,
  account: Web3Account,
  contractAddress: `0x${string}`,
  stableTokenAddress: `0x${string}`,
  value: string
) {
  // Estimate gas for the transaction
  const gasEstimate = await estimateGas(client, {
    data: "0x" as any,
    account: account?.ownAddress! as any,
    to: contractAddress as any,
    stable_token_address: stableTokenAddress as any,
  });

  // Get current gas price
  const gasPrice = await client.getGasPrice();

  // Parse the value to be sent
  const parsedValue = parseEther(value);

  // Calculate the total cost of the transaction
  const totalCost = gasEstimate * gasPrice + parsedValue;

  // Get the account balance
  const accountBalance = await client.getBalance({
    address: account?.ownAddress!,
  });

  // Check if the account balance is sufficient
  const isSufficientFunds = accountBalance >= totalCost;

  return { isSufficientFunds, totalCost };
}
