# OSS Donate

This project is a decentralized application (dApp) built for the "Build with Celo: Transform rewards and loyalty" hackathon. It allows users to donate cUSD to their favorite open-source projects or libraries. Contributors receive nfts as rewards, which can be used for prioritized feature requests and assistance in community help channels.

## Features

1. **Donation System:**

   - Users can donate cUSD to support their favorite open-source projects or maintainers.

2. **Personal Finance Focus:**

   - **Maintainer Dashboard:** Maintainers can view a dashboard showing total contributions received.
   - **Contributor Insights:** Contributors can see their donation history and the impact of their contributions.

3. **Reward and Loyalty System:**

   - **Stickers as Rewards:** Contributors receive NFTs for their contributions.
   - **Priority Feature Requests:** NFTs can be used to prioritize feature requests based on donation task completed.
   - **Community Assistance:** NFTs can also be used to get prioritized assistance in community help channels.

4. **E-commerce Integration:**

   - **Merchandise Shop:** An integrated online shop where maintainers can sell merchandise related to their projects.
   - **cUSD Payments:** Contributors can purchase items using cUSD, with proceeds going to the maintainers.

## Getting Started

### Prerequisites

- Node.js and npm or pnpm
- Hardhat for smart contract development or Remix IDE
- A web browser with MetaMask or Celo Extension Wallet

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/emee-dev/oss-donate.git
   cd oss-donate
   ```

2. Install dependencies:

   ```bash
   npm install

   or

   pnpm install
   ```

3. Environment variables:

   Copy the contents of `.env.example` to a new file `.env.local`. You can retrieve those values from your metamask wallet.

4. Compile the smart contracts:

   ```bash
   pnpm run hardhat:compile
   ```

5. Deploy the smart contracts to the contract:

   ```bash
   pnpm run hardhat:localhost // hardhat localhost network

   or

    pnpm run hardhat:localhost // Celo testnet alfjores

   or

    pnpm run hardhat:mainnet // Celo mainnet
   ```

6. In a new terminal, start frontend dev server:

   ```bash
   pnpm run frontend:dev
   ```

7. Open your web browser and navigate to `http://localhost:3000`.

## Smart Contracts

- **Contribution Total:** Tracks contributions and provides summaries for maintainers.
- **Merchandise Shop:** Manages the sale of merchandise and handles cUSD payments.
- **Microwork:** Allows maintainers to post tasks and reward contributors upon completion.

## Contributing

We welcome contributions to enhance the functionality of this dApp. Please open an issue or submit a pull request with your improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
