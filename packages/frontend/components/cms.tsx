"use client";

// import Celo from "@/components/icons/celo";
// import Metamask from "@/components/icons/metamask";
// import Minipay from "@/components/icons/minipay";
import dynamic from "next/dynamic";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Fragment } from "react";

// Dynamically import the icon components
const Celo = dynamic(() => import("@/components/icons/celo"));
const Metamask = dynamic(() => import("@/components/icons/metamask"));
const Minipay = dynamic(() => import("@/components/icons/minipay"));

const Cms = () => {
  const cms = [
    {
      component: <Celo height={42} width={42} className=" " />,
      name: "Celo Blockchain",
    },
    {
      component: <Minipay height={42} width={42} className=" " />,
      name: "Minipay",
    },
    {
      component: <Metamask height={42} width={42} />,
      name: "Metamask",
    },
  ];

  return (
    <div className="mx-5 mt-5">
      <p className="mb-8 text-sm font-medium text-center text-muted-foreground">
        POWERED BY THE MOST INCREDIBLE SOLUTIONS
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 mx-auto fill-foreground lg:gap-x-14">
        {cms.map((item) => (
          <Fragment key={item.name}>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  aria-label={item.name}
                  className="cursor-default"
                >
                  {item.component}
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Cms;
