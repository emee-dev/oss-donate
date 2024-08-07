"use client";

import { Button } from "@/components/ui/button";
import { useWeb3Context } from "@/context";
import { Suspense } from "react";
import {
  BookDashed,
  HandCoins,
  LayoutDashboard,
  Pickaxe,
  ShieldCheck,
} from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useReadContract } from "wagmi";
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
import abi from "@/abi/sample";
import { CONTRACT_ADDRESS } from "@/providers/constants";
import Loading from "./loading";

const links = [
  {
    href: "/repo/maintainer",
    icon: LayoutDashboard,
    text: "Dashboard",
  },
  {
    href: "/repo/claim",
    icon: Pickaxe,
    text: "Claim",
  },
  {
    href: "/repo/verify",
    icon: ShieldCheck,
    text: "Verify",
  },
  {
    href: "/repo/donate",
    icon: HandCoins,
    text: "Donate",
  },
];

type ComponentProps = {
  params: {};
  children: React.ReactNode;
};

const RepositoryLayout = ({ children }: ComponentProps) => {
  // let { address } = useAccount();
  let { account, setAccountAddress } = useWeb3Context();
  const { isPending, connect } = useConnect();
  const [hidden, setHidden] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   if (window.ethereum) {
  //     connect({ connector: injected({ target: "metaMask" }) });
  //   }
  // }, []);

  // useEffect(() => {
  //   if (address) {
  //     setAccountAddress(address);
  //   }
  // }, [address]);

  // Connect
  useEffect(() => {
    if (account && !account.ownAddress) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (pathname === "/repo/maintainer") {
      setHidden(true);
      console.log("pathname", pathname);
    }
  }, [pathname]);

  return (
    <div className="flex flex-1 relative bg-muted h-screen justify-center items-center font-mono">
      <div className="absolute right-8 top-5">
        {!hidden && <DrawerDialogDemo />}
      </div>
      {/* <Suspense fallback={<p>Loading UI...</p>}>{children}</Suspense> */}
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
};

function DrawerDialogDemo() {
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
        <PageLinks setOpen={setOpen} className="text-lg my-2 last:mb-10 ml-2" />
      </DrawerContent>
    </Drawer>
  );
}

const PageLinks = (props: {
  setOpen: (st: boolean) => void;
  className?: string;
}) => {
  return (
    <div className="flex flex-col">
      {links.map((link, index) => {
        const IconComponent = link.icon;
        return (
          <Link href={link.href} key={index} className={props.className}>
            <Button
              type="button"
              variant="link"
              className="flex items-center"
              onClick={() => props.setOpen(false)}
            >
              <IconComponent size="1.1rem" className="mr-4" />
              {link.text}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};

export default RepositoryLayout;
