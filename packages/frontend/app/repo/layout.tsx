"use client";

import { useWeb3Context } from "@/context";
import { useContext } from "@/hooks/useTheme";
import { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

const STABLE_TOKEN_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

type ComponentProps = {
  params: {};
  children: React.ReactNode;
};

const Repository = ({ children }: ComponentProps) => {
  let { address, status } = useAccount();
  let { setAccountAddress } = useWeb3Context();

  const { connect } = useConnect();

  useEffect(() => {
    if (window.ethereum) {
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  useEffect(() => {
    if (address) {
      setAccountAddress(address);
    }
  }, [address]);

  // if(!account) {
  //   return
  // }

  return (
    <div className="flex flex-1 bg-muted h-screen justify-center items-center font-mono">
      {children}
    </div>
  );
};

export default Repository;
