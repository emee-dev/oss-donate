"use client";

import { Button } from "@/components/ui/button";
import { useWeb3Context } from "@/context";
import {
  BookDashed,
  HandCoins,
  LayoutDashboard,
  Pickaxe,
  ShieldCheck,
} from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

type ComponentProps = {
  params: {};
  children: React.ReactNode;
};

const Repository = ({ children }: ComponentProps) => {
  let { address, status } = useAccount();
  let { setAccountAddress } = useWeb3Context();
  const { connect } = useConnect();
  const [hidden, setHidden] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (window.ethereum) {
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  useEffect(() => {
    if (address) {
      setAccountAddress(address);
    } else {
      router.push("/");
    }
  }, [address]);

  useEffect(() => {
    if (pathname === "/repo/user") {
      setHidden(true);
      console.log("pathname", pathname);
    }
  }, [pathname]);

  return (
    <div className="flex flex-1 relative bg-muted h-screen justify-center items-center font-mono">
      <div className="absolute right-8 top-5">
        {!hidden && <DrawerDialogDemo />}
      </div>
      {children}
    </div>
  );
};

export function DrawerDialogDemo() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="p-3">
            <BookDashed size={"1.2rem"} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Application Pages</DialogTitle>
            <DialogDescription>
              Navigate to the appropriate page
            </DialogDescription>
          </DialogHeader>
          <PageLinks setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="p-3">
          <BookDashed size={"1.2rem"} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Application Pages</DrawerTitle>
          <DrawerDescription>
            Navigate to the appropriate page
          </DrawerDescription>
        </DrawerHeader>
        <PageLinks setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  );
}

const PageLinks = (props: { setOpen: (st: boolean) => void }) => {
  return (
    <div className="flex flex-col">
      <Link href="/repo/user">
        <Button
          type="button"
          variant={"link"}
          className="flex items-center"
          onClick={() => props.setOpen(false)}
        >
          <LayoutDashboard size="1.1rem" className="mr-4" />
          Dashboard
        </Button>
      </Link>
      <Link href="/repo/claim">
        <Button
          type="button"
          variant={"link"}
          className="flex items-center"
          onClick={() => props.setOpen(false)}
        >
          <Pickaxe size="1.1rem" className="mr-4" />
          Claim
        </Button>
      </Link>
      <Link href="/repo/verify">
        <Button
          type="button"
          variant={"link"}
          className="flex items-center"
          onClick={() => props.setOpen(false)}
        >
          <ShieldCheck size="1.1rem" className="mr-4" />
          Verify
        </Button>
      </Link>
      <Link href="/repo/donate">
        <Button
          type="button"
          variant={"link"}
          className="flex items-center"
          onClick={() => props.setOpen(false)}
        >
          <HandCoins size="1.1rem" className="mr-4" />
          Donate
        </Button>
      </Link>
    </div>
  );
};

export default Repository;
