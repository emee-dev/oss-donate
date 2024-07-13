"use client";

import { type FeatureCardProps } from "@/types/feature-card";
import {
  BlocksIcon,
  DollarSignIcon,
  MessagesSquareIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
// import FeatureCard from "./feature-card";

const FeatureCard = dynamic(() => import("./feature-card"));

const featuresData: FeatureCardProps[] = [
  {
    title: "Highly customizable",
    description: "Customize the platform to your needs and make it your own.",
    icon: <SettingsIcon size={28} className="text-blue-500" />,
    backgroundColor: "from-blue-500/20 to-blue-500/5",
  },
  {
    title: "Secure and reliable",
    description: "We take security seriously and ensure your data is safe.",
    icon: <ShieldCheckIcon size={28} className="text-green-500" />,
    backgroundColor: "from-green-500/20 to-green-500/5",
  },
  {
    title: "Easy to use",
    description: "The platform is easy to use and requires no training.",
    icon: <ZapIcon size={28} className="text-yellow-500 " />,
    backgroundColor: "from-yellow-500/20 to-yellow-500/5",
  },
  {
    title: "Powerful integrations",
    description: "Integrate with your favorite tools and services, and more.",
    icon: <BlocksIcon className="text-red-500" />,
    backgroundColor: "from-red-500/20 to-red-500/5",
  },
  {
    title: "Affordable pricing",
    description: "We offer affordable pricing plans for all business sizes.",
    icon: <DollarSignIcon className="text-pink-500" />,
    backgroundColor: "from-pink-500/20 to-pink-500/5",
  },
  {
    title: "24/7 support",
    description: "Our support team is available 24/7 to help you out.",
    icon: <MessagesSquareIcon size={28} className="text-purple-500" />,
    backgroundColor: "from-purple-500/20 to-purple-500/5",
  },
];

const Features = () => {
  return (
    <section className="px-5 mx-auto mt-28 max-w-7xl">
      <div className="flex flex-col max-w-2xl gap-6 mx-auto text-center">
        <div>
          <span className="px-3 py-1 text-sm font-medium border rounded-full border-primary/30 bg-primary/10 text-primary dark:bg-primary/25">
            <span className="brightness-[1.7]">Powerful Features</span>
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight scroll-m-20 font-inter lg:text-5xl">
            <span className="text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
              Advanced{" "}
            </span>
            <span className="text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
              Solutions{" "}
            </span>
            <span className="text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
              for{" "}
            </span>
            <span className="text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
              Business{" "}
            </span>
            <span className="text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
              Excellence
            </span>
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          <span className="hidden lg:block">
            Explore a diverse range of cutting-edge tools meticulously crafted
            to drive your business towards unparalleled success.
          </span>
          <span className="block lg:hidden">
            Explore a diverse range of cutting-edge tools crafted for business
            success.
          </span>
        </p>
      </div>
      <div>
        <ul className="grid gap-20 mt-20 place-content-center md:grid-cols-2 lg:grid-cols-3">
          {featuresData.map((feature, i) => (
            <li key={i}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                backgroundColor={feature.backgroundColor}
                icon={feature.icon}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Features;
