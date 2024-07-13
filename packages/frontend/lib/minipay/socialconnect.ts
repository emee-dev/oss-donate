import { OdisUtils } from "@celo/identity";
import { IdentifierPrefix } from "@celo/identity/lib/odis/identifier";
import { getContract, parseEther } from "viem";
import {
  SERVICE_CONTEXT,
  getCoreContractAddress,
  publicClient,
} from "./constants";

import {
  federatedAttestationsABI,
  odisPaymentsABI,
  stableTokenABI,
} from "@celo/abis";

export const ONE_CENT_CUSD = parseEther("0.01");
export const NOW_TIMESTAMP = Math.floor(new Date().getTime() / 1000);

// export class SocialConnectIssuer {
//   private readonly federatedAttestationsContract: Contract;
//   private readonly odisPaymentsContract: Contract;
//   private readonly stableTokenContract: Contract;
//   readonly serviceContext: ServiceContext;

//   constructor(
//     private readonly wallet: Wallet,
//     private readonly authSigner: AuthSigner
//   ) {
//     this.serviceContext = OdisUtils.Query.getServiceContext(SERVICE_CONTEXT);
//     this.federatedAttestationsContract = new Contract(
//       FA_PROXY_ADDRESS,
//       FA_CONTRACT.abi,
//       this.wallet
//     );
//     this.odisPaymentsContract = new Contract(
//       ODIS_PAYMENTS_PROXY_ADDRESS,
//       ODIS_PAYMENTS_CONTRACT.abi,
//       this.wallet
//     );
//     this.stableTokenContract = new Contract(
//       STABLE_TOKEN_ADDRESS,
//       STABLE_TOKEN_CONTRACT.abi,
//       this.wallet
//     );
//   }

//   async getObfuscatedId(plaintextId: string, identifierType: IdentifierPrefix) {
//     // TODO look into client side blinding
//     const { obfuscatedIdentifier } =
//       await OdisUtils.Identifier.getObfuscatedIdentifier(
//         plaintextId,
//         identifierType,
//         this.wallet.address,
//         this.authSigner,
//         this.serviceContext
//       );
//     return obfuscatedIdentifier;
//   }

//   async checkAndTopUpODISQuota() {
//     const remainingQuota = await this.checkODISQuota();

//     if (remainingQuota < 1) {
//       // TODO make threshold a constant
//       const approvalTxReceipt = (
//         await this.stableTokenContract.increaseAllowance(
//           this.odisPaymentsContract.address,
//           ONE_CENT_CUSD // TODO we should increase by more
//         )
//       ).wait();

//       console.log(approvalTxReceipt);

//       const odisPaymentTxReceipt = (
//         await this.odisPaymentsContract.payInCUSD(
//           this.wallet.address,
//           ONE_CENT_CUSD // TODO we should increase by more
//         )
//       ).wait();

//       console.log(odisPaymentTxReceipt);
//     }
//   }

//   async getObfuscatedIdWithQuotaRetry(
//     plaintextId: string,
//     identifierType: IdentifierPrefix
//   ) {
//     try {
//       return await this.getObfuscatedId(plaintextId, identifierType);
//     } catch {
//       await this.checkAndTopUpODISQuota();
//       return this.getObfuscatedId(plaintextId, identifierType);
//     }
//   }

//   async registerOnChainIdentifier(
//     plaintextId: string,
//     identifierType: IdentifierPrefix,
//     address: string
//   ) {
//     const obfuscatedId = await this.getObfuscatedIdWithQuotaRetry(
//       plaintextId,
//       identifierType
//     );

//     const tx =
//       await this.federatedAttestationsContract.registerAttestationAsIssuer(
//         // TODO check if there are better code patterns for sending txs
//         obfuscatedId,
//         address,
//         NOW_TIMESTAMP
//       );
//     const receipt = await tx.wait();
//     return receipt;
//   }

//   async deregisterOnChainIdentifier(
//     plaintextId: string,
//     identifierType: IdentifierPrefix,
//     address: string
//   ) {
//     const obfuscatedId = await this.getObfuscatedIdWithQuotaRetry(
//       plaintextId,
//       identifierType
//     );
//     const tx = await this.federatedAttestationsContract.revokeAttestation(
//       obfuscatedId,
//       this.wallet.address,
//       address
//     );
//     const receipt = await tx.wait();
//     return receipt;
//   }

//   async checkODISQuota() {
//     const { remainingQuota } = await OdisUtils.Quota.getPnpQuotaStatus(
//       this.wallet.address,
//       this.authSigner,
//       this.serviceContext
//     );
//     console.log("Remaining Quota", remainingQuota);
//     return remainingQuota;
//   }

//   async lookup(
//     plaintextId: string,
//     identifierType: IdentifierPrefix,
//     issuerAddresses: string[]
//   ) {
//     const obfuscatedId = await this.getObfuscatedIdWithQuotaRetry(
//       plaintextId,
//       identifierType
//     );
//     console.log(obfuscatedId);
//     const attestations =
//       await this.federatedAttestationsContract.lookupAttestations(
//         obfuscatedId,
//         issuerAddresses
//       );
//     console.log(attestations);
//     return {
//       accounts: attestations.accounts as string[], // TODO typesafety
//       obfuscatedId,
//     };
//   }
// }

export class SocialConnectIssuer {
  walletClient;
  authSigner;

  federatedAttestationsContractAddress: any;
  federatedAttestationsContract: any;

  odisPaymentsContractAddress: any;
  odisPaymentsContract: any;

  stableTokenContractAddress: any;
  stableTokenContract: any;

  serviceContext;
  initialized = false;

  constructor(walletClient: any, authSigner: any) {
    this.walletClient = walletClient;
    this.authSigner = authSigner;
    this.serviceContext = OdisUtils.Query.getServiceContext(SERVICE_CONTEXT);
  }

  async initialize() {
    this.federatedAttestationsContractAddress = await getCoreContractAddress(
      "FederatedAttestations"
    );

    this.federatedAttestationsContract = getContract({
      address: this.federatedAttestationsContractAddress,
      abi: federatedAttestationsABI,

      // Needed for lookup
      // client: publicClient,

      // Needed for registeration and de-registration
      // walletClient: this.walletClient,

      client: { public: publicClient, wallet: this.walletClient },
    });

    this.odisPaymentsContractAddress = await getCoreContractAddress(
      "OdisPayments"
    );
    this.odisPaymentsContract = getContract({
      address: this.odisPaymentsContractAddress,
      abi: odisPaymentsABI,
      client: this.walletClient,
      // walletClient: this.walletClient,
    });

    this.stableTokenContractAddress = await getCoreContractAddress(
      "StableToken"
    );
    this.stableTokenContract = getContract({
      address: this.stableTokenContractAddress,
      abi: stableTokenABI,

      // walletClient: this.walletClient,
      client: this.walletClient,
    });

    this.initialized = true;
  }

  private async getObfuscatedId(
    plaintextId: string,
    identifierType: IdentifierPrefix
  ) {
    // TODO look into client side blinding
    const { obfuscatedIdentifier } =
      await OdisUtils.Identifier.getObfuscatedIdentifier(
        plaintextId,
        identifierType,
        this.walletClient.account.address,
        this.authSigner,
        this.serviceContext
      );
    return obfuscatedIdentifier;
  }

  private async checkAndTopUpODISQuota() {
    const remainingQuota = await this.checkODISQuota();

    if (remainingQuota < 1) {
      // TODO make threshold a constant
      let approvalTxHash =
        await this.stableTokenContract.write.increaseAllowance([
          this.odisPaymentsContractAddress,
          ONE_CENT_CUSD, // TODO we should increase by more
        ]);

      let approvalTxReceipt = await publicClient.waitForTransactionReceipt({
        hash: approvalTxHash,
      });

      let odisPaymentTxHash = await this.odisPaymentsContract.write.payInCUSD([
        this.walletClient.account,
        ONE_CENT_CUSD, // TODO we should increase by more
      ]);

      let odisPaymentReceipt = await publicClient.waitForTransactionReceipt({
        hash: odisPaymentTxHash,
      });
    }
  }

  async getObfuscatedIdWithQuotaRetry(
    plaintextId: string,
    identifierType: IdentifierPrefix
  ) {
    if (this.initialized) {
      try {
        return await this.getObfuscatedId(plaintextId, identifierType);
      } catch {
        await this.checkAndTopUpODISQuota();
        return this.getObfuscatedId(plaintextId, identifierType);
      }
    }
    throw new Error("SocialConnect instance not initialized");
  }

  async registerOnChainIdentifier(
    plaintextId: string,
    identifierType: IdentifierPrefix,
    address: string
  ) {
    if (this.initialized) {
      const obfuscatedId = await this.getObfuscatedIdWithQuotaRetry(
        plaintextId,
        identifierType
      );

      const hash =
        await this.federatedAttestationsContract.write.registerAttestationAsIssuer(
          [
            // TODO check if there are better code patterns for sending txs
            obfuscatedId,
            address,
            NOW_TIMESTAMP,
          ]
        );

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      return receipt;
    }
    throw new Error("SocialConnect instance not initialized");
  }

  async deregisterOnChainIdentifier(
    plaintextId: string,
    identifierType: IdentifierPrefix,
    address: string
  ) {
    if (this.initialized) {
      const obfuscatedId = await this.getObfuscatedIdWithQuotaRetry(
        plaintextId,
        identifierType
      );
      const hash =
        await this.federatedAttestationsContract.write.revokeAttestation([
          obfuscatedId,
          this.walletClient.account.address,
          address,
        ]);

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      return receipt;
    }
    throw new Error("SocialConnect instance not initialized");
  }

  async checkODISQuota() {
    if (this.initialized) {
      const { remainingQuota } = await OdisUtils.Quota.getPnpQuotaStatus(
        this.walletClient.account.address,
        this.authSigner,
        this.serviceContext
      );
      console.log("Remaining Quota", remainingQuota);
      return remainingQuota;
    }
    throw new Error("SocialConnect instance not initialized");
  }

  async lookup(
    plaintextId: string,
    identifierType: IdentifierPrefix,
    issuerAddresses: string[]
  ) {
    if (this.initialized) {
      const obfuscatedId = await this.getObfuscatedIdWithQuotaRetry(
        plaintextId,
        identifierType
      );

      const attestations =
        await this.federatedAttestationsContract.read.lookupAttestations([
          obfuscatedId,
          issuerAddresses,
        ]);

      return {
        accounts: attestations[1], // Viem returns data as is from contract not in JSON
        obfuscatedId,
      };
    }
    throw new Error("SocialConnect instance not initialized");
  }
}
