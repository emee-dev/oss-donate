"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import saasstellar from "../assets/saasstellar.svg";
import { useForm } from "@formspree/react";
import { Loader2Icon } from "lucide-react";
import Saastellar from "@/components/icons/saasstellar";
import { cn } from "@/lib/utils";
import useTheme from "@/hooks/use-theme";

const Banner = () => {
  const [state, handleSubmit] = useForm("mjvqrzpz");
  const [theme, setTheme] = useTheme();
  return (
    <section className="relative flex flex-col items-center justify-between gap-10 mt-40 bg-gradient-to-br from-primary/20 via-transparent to-primary/20">
      <div className="h-[1px] w-full bg-gradient-to-r from-primary to-transparent"></div>
      <div className="relative w-full px-5 max-w-7xl">
        <div className="flex justify-between">
          <div className="flex flex-col max-w-2xl gap-6 mx-auto lg:mx-0">
            <div>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-center scroll-m-20 font-inter lg:text-left lg:text-5xl">
                <span className="text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
                  Empower{" "}
                </span>
                <span className="text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
                  and{" "}
                </span>
                <span className="text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
                  boost{" "}
                </span>
                <span className="text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
                  your{" "}
                </span>
                <span className="text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
                  business's{" "}
                </span>
                <span className="text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
                  productivity
                </span>
              </h1>
            </div>
            <p className="text-lg text-center text-muted-foreground lg:text-left">
              Unlock the potential of your business with SaaSStellar. Experience
              simplified operations.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-end w-full max-w-md gap-2 mx-auto lg:mx-0 lg:flex-row"
            >
              <div className="flex w-full  max-w-sm basis-2/3 flex-col items-start gap-1.5">
                <Label
                  className="text-left text-muted-foreground"
                  htmlFor="email-banner"
                >
                  Want an early invite?
                </Label>
                <Input
                  name="email-banner"
                  required
                  id="email-banner"
                  type="email"
                  placeholder="john.doe@example.com"
                />
              </div>

              {!state.succeeded && (
                <Button
                  type="submit"
                  className="w-full max-w-sm lg:w-fit"
                  disabled={state.submitting}
                >
                  {state.submitting && (
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {state.submitting && "Joining"}
                  {!state.submitting && "Join the waitlist"}
                </Button>
              )}
              {state.succeeded && (
                <Button
                  variant={"secondary"}
                  className="w-full max-w-sm pointer-events-none lg:w-fit"
                >
                  You're in! 🔥
                </Button>
              )}
            </form>
          </div>
          <Saastellar
            linearFrom="text-primary"
            className="absolute hidden w-48 -bottom-10 right-5 lg:block"
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
          />
          {/* <img
                        src={saasstellar}
                        alt=''
                        width={196}
                        className='absolute hidden -bottom-10 right-5 lg:block'
                    /> */}
        </div>
      </div>
      <div className="h-[1px] w-full bg-gradient-to-l from-primary to-transparent"></div>
    </section>
  );
};

export default Banner;
