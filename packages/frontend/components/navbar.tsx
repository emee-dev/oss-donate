"use client";

import useTheme from "@/hooks/use-theme";
import { GithubIcon, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

// const Saastellar = dynamic(() => import("@/components/icons/saasstellar"));

const Navbar = () => {
  const [theme, setTheme] = useTheme();
  return (
    <div className="px-5 py-2">
      <nav className="flex items-center justify-between mx-auto max-w-7xl">
        <Link href={"/"} className="flex items-center gap-2">
          {/* <Saastellar
            aria-label="saasstellar logo"
            linearFrom="text-primary"
            className="w-7"
            linearTo={cn(
              "text-primary",
              theme === "zinc" && "text-zinc-600",
              theme === "slate" && "text-slate-600",
              theme === "stone" && "text-stone-600",
              theme === "gray" && "text-gray-600",
              theme === "neutral" && "text-neutral-600",
              theme === "red" && "text-red-600",
              theme === "rose" && "text-pink-600",
              theme === "orange" && "text-rose-600",
              theme === "green" && "text-emerald-600",
              theme === "blue" && "text-purple-600",
              theme === "yellow" && "text-yellow-600",
              theme === "violet" && "text-violet-600"
            )}
          /> */}
          {/* <span className="hidden text-lg font-semibold md:block">
            OSS Donate
          </span> */}
          <span className="text-lg font-semibold md:block">OSS Donate</span>
        </Link>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/emee-dev/oss-donate"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-colors border rounded-md border-input bg-background/30 ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10"
            aria-label="my github"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          {/* Theme changer */}
          {/* <Select
            onValueChange={(theme: ThemeName) => {
              changeTheme(theme);
              setTheme(theme);
            }}
            value={theme}
          >
            <SelectTrigger className="w-[180px]" aria-label="customize theme">
              <SelectValue placeholder="Customize" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="zinc">
                <span className="flex items-center gap-2 pointer-events-none">
                  <span className="w-4 h-4 p-1 rounded-full bg-zinc-600"></span>{" "}
                  <span>Zinc</span>
                </span>
              </SelectItem>
              <SelectItem value="slate">
                {" "}
                <span className="flex items-center gap-2 pointer-events-none">
                  <span className="w-4 h-4 p-1 rounded-full bg-slate-600"></span>{" "}
                  <span>Slate</span>
                </span>
              </SelectItem>
              <SelectItem value="stone">
                {" "}
                <span className="flex items-center gap-2 pointer-events-none">
                  <span className="w-4 h-4 p-1 rounded-full bg-stone-600"></span>{" "}
                  <span>Stone</span>
                </span>
              </SelectItem>
              <SelectItem value="gray">
                {" "}
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 p-1 bg-gray-600 rounded-full"></span>{" "}
                  <span>Gray</span>
                </span>
              </SelectItem>
              <SelectItem value="neutral">
                {" "}
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 p-1 rounded-full bg-neutral-600"></span>{" "}
                  <span>Neutral</span>
                </span>
              </SelectItem>
              <SelectItem value="red">
                {" "}
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 p-1 bg-red-600 rounded-full"></span>{" "}
                  <span>Red</span>
                </span>
              </SelectItem>
              <SelectItem value="rose">
                {" "}
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 p-1 rounded-full bg-rose-600"></span>{" "}
                  <span>Rose</span>
                </span>
              </SelectItem>
              <SelectItem value="orange">
                {" "}
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 p-1 bg-orange-600 rounded-full"></span>{" "}
                  <span>Orange</span>
                </span>
              </SelectItem>
              <SelectItem value="green">
                {" "}
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 p-1 bg-green-600 rounded-full"></span>{" "}
                  <span>Green</span>
                </span>
              </SelectItem>
              <SelectItem value="blue">
                {" "}
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 p-1 bg-blue-600 rounded-full"></span>{" "}
                  <span>Blue</span>
                </span>
              </SelectItem>
              <SelectItem value="yellow">
                {" "}
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 p-1 bg-yellow-600 rounded-full"></span>{" "}
                  <span>Yellow</span>
                </span>
              </SelectItem>
              <SelectItem value="violet">
                {" "}
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 p-1 rounded-full bg-violet-600"></span>{" "}
                  <span>Violet</span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select> */}
          <Link href="/repo/claim">
            <Button size="sm">
              Claim Project
              <UserRoundPlus className="w-4 h-4 ml-3" />
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
