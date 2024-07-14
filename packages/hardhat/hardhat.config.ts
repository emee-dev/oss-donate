import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

// if (!process.env.PRIVATE_KEY) {
//   console.warn(
//     "Please copy the contents of .env.example > .env.local and fill the values"
//   );
// }

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  paths: {
    artifacts: "../frontend/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
      loggingEnabled: true,
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 44787,
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: [process.env.PRIVATE_KEY!],
      // accounts: {
      //   mnemonic: process.env.MNEMONIC,
      //   path: "m/44'/52752'/0'/0",
      // },
      chainId: 42220,
    },
  },
  // etherscan: {
  //     apiKey: {
  //         alfajores: process.env.CELOSCAN_API_KEY,
  //         celo: process.env.CELOSCAN_API_KEY,
  //     },
  //     customChains: [
  //         {
  //             network: "alfajores",
  //             chainId: 44787,
  //             urls: {
  //                 apiURL: "https://api-alfajores.celoscan.io/api",
  //                 browserURL: "https://alfajores.celoscan.io",
  //             },
  //         },
  //         {
  //             network: "celo",
  //             chainId: 42220,
  //             urls: {
  //                 apiURL: "https://api.celoscan.io/api",
  //                 browserURL: "https://celoscan.io/",
  //             },
  //         },
  //     ],
  // },
};

export default config;
