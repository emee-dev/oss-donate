"use client";

import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

import { useEffect, useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

/* 
Detected multiple Jotai instances. It may cause unexpected behavior with the default store. https://github.com/pmndrs/jotai/discussions/2044

*/

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gypsum">
      <Header />
      <div className="py-16 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8">
        {children}
        <Home />
      </div>
    </div>
  );
};

const Home = () => {
  const [userAddress, setUserAddress] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { address, isConnected } = useAccount();

  const { data: hash, sendTransaction } = useSendTransaction();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        onClick={() => {
          sendTransaction({
            to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
            value: parseEther("0.1"),
          });
        }}
      >
        Submit Transaction 0.1eth
      </Button>
      <div className="h1">
        There you go... a canvas for your next Celo project!
      </div>
      {isConnected ? (
        <>
          <div className="text-center h2">Your address: {userAddress}</div>
          <div className="text-center h2">
            {/* Your balance: {balance.data?.value} */}
          </div>
        </>
      ) : (
        <div>No Wallet Connected</div>
      )}

      <div>Transaction Hash {hash}</div>
    </div>
  );
};

export default Layout;
