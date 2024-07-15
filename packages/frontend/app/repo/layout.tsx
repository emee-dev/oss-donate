"use client";

import { Button } from "@/components/ui/button";
import { useWeb3Context } from "@/context";
import { BookDashed } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/use-media-query";
import Link from "next/link";

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
    <div className="flex flex-1 relative bg-muted h-screen justify-center items-center font-mono">
      <div className="absolute right-8 top-5">
        {/* <Button variant="outline" size="sm">
          <BookDashed />
        </Button> */}
        <DrawerDialogDemo />
      </div>
      {children}
    </div>
  );
};

export function DrawerDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <BookDashed />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Application Pages</DialogTitle>
            <DialogDescription>
              Navigate to the appropriate page
            </DialogDescription>
          </DialogHeader>
          <PageLinks />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <BookDashed />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Application Pages</DrawerTitle>
          <DrawerDescription>
            Navigate to the appropriate page
          </DrawerDescription>
        </DrawerHeader>
        <PageLinks />
      </DrawerContent>
    </Drawer>
  );
}

const PageLinks = () => {
  return (
    <div className="flex flex-col">
      <Link href="/repo/claim">
        <Button type="button" variant={"link"}>
          Claim
        </Button>
      </Link>
      <Link href="/repo/verify">
        <Button type="button" variant={"link"}>
          Verify
        </Button>
      </Link>
      <Link href="/repo/donate">
        <Button type="button" variant={"link"}>
          Donate
        </Button>
      </Link>
      <Link href="/repo/user">
        <Button type="button" variant={"link"}>
          Dashboard
        </Button>
      </Link>
    </div>
  );
};
export default Repository;
