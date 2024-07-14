"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import {
  useAccount,
  useBalance,
  useConnect,
  useEnsName,
  useSendTransaction,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { useWriteContract, useReadContract } from "wagmi";

import { getContract, formatEther, createPublicClient, http } from "viem";
import { celo } from "viem/chains";
import { stableTokenABI } from "@celo/abis";
import { publicClient } from "@/providers/constants";
import { Button } from "@/components/ui/button";
import abi from "@/abi/sample";

const STABLE_TOKEN_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

async function checkCUSDBalance(publicClient: any, address: string) {
  let StableTokenContract = getContract({
    abi: stableTokenABI,
    address: STABLE_TOKEN_ADDRESS,
    client: publicClient,
  });

  //@ts-expect-error
  let balanceInBigNumber = await StableTokenContract.read.balanceOf([address]);

  let balanceInWei = balanceInBigNumber.toString();

  let balanceInEthers = formatEther(balanceInWei);

  return balanceInEthers;
}

const MobilePage = () => {
  const { address } = useAccount();
  const { data: hash, writeContract, isPending } = useWriteContract();

  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const [userAddress, setAddress] = useState<`0x&{string}` | undefined>(
    undefined
  );
  const [userBalance, setBalance] = useState<string>("");
  const { connect } = useConnect();

  const accountAddress = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [],
    });

    // Injected wallets inject all available addresses,
    // to comply with API Minipay injects one address but in the form of array
    console.log(accounts[0]);
    setAddress(accounts[0]);
  };

  const main = async (userAddress: any) => {
    let bal = await checkCUSDBalance(publicClient, userAddress);
    setBalance(bal);
  };

  //   useEffect(() => {
  //     if (userAddress) {
  //       main(userAddress);
  //     }
  //   }, [userAddress]);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      // User is using MiniPay so hide connect wallet button.
      setHideConnectBtn(true);
      accountAddress();

      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  return (
    <div>
      <div>Address: {userAddress}</div>
      <div>Wagmi Address: {address}</div>

      <div>Balance minipay: {userBalance}</div>
      <div>Transaction Hash: {hash}</div>
      <div>IsPending Hash: {isPending ? "true" : "false"}</div>

      <Button
        onClick={() => {
          if (!address) {
            console.warn("Address is not available");
            return;
          }
          writeContract({
            address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            abi: abi,
            functionName: "registerProject",
            args: ["https://github.com/emee-dev/treblle-monorepo", address],
          });
        }}
      >
        Register Project
      </Button>
    </div>
  );
};

export default MobilePage;
