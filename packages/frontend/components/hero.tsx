"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import dynamic from "next/dynamic";

// Dynamically import the icon components
const Anchor = dynamic(() => import("@/components/icons/anchor"));
const Fire = dynamic(() => import("@/components/icons/fire"));
const Flower = dynamic(() => import("@/components/icons/flower"));
const Lightning = dynamic(() => import("@/components/icons/lightning"));
const Swirl = dynamic(() => import("@/components/icons/swirl"));

// import useTheme from "@/hooks/use-theme";
import useTheme from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { urlEncode } from "@/lib/github";
import { useMutation } from "@tanstack/react-query";
import { GithubResponse } from "@/app/api/route";
import axios from "axios";
import { LazyMotion, domAnimation, m as motion } from "framer-motion";
import { Loader2Icon, MoveRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "./ui/form";

type Formdata = { repo: string };

const Hero = () => {
  const [theme] = useTheme();
  const router = useRouter();
  const form = useForm<Formdata>();

  const {
    data: repo,
    isPending,
    mutate,
  } = useMutation<GithubResponse, null, { github_repo: string }>({
    mutationKey: ["donate_project"],
    mutationFn: async (payload) => {
      try {
        let req = await axios.post("/api", payload);
        let repo = req.data as GithubResponse;

        if (repo?.funding_file?.ossdonate) {
          router.push(`/repo/donate?repo=${urlEncode(payload.github_repo)}`);
        }

        console.log("github repo", repo);

        return Promise.resolve(req.data);
      } catch (e: any) {
        let error = e.message as string;
        console.error("Error", error);
        return Promise.reject(error);
      }
    },
  });

  const onSubmit = (inputdata: Formdata) => {
    console.log(inputdata);

    mutate({ github_repo: inputdata.repo });
  };

  // useEffect(() => {
  //   if (repo && repo.data?.funding_file?.ossdonate) {
  //     router.push(`/claim?action=claim&repo=${form.getValues("repo")}`);
  //   }
  // }, [repo]);

  return (
    <main className="mx-auto my-10 select-none flex min-h-[calc(100vh-73px)] max-w-2xl flex-col justify-center gap-6 px-5 text-center lg:my-0">
      <LazyMotion features={domAnimation}>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "scroll-m-20 font-inter text-4xl font-extrabold tracking-tight lg:text-5xl"
          )}
        >
          <span className="text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
            OSS
          </span>{" "}
          <span className="text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
            Donations{" "}
          </span>
          <span
            className={cn(
              "relative bg-gradient-to-r from-primary bg-clip-text text-5xl font-extrabold text-transparent lg:text-8xl",
              theme === "orange" && "to-rose-600"
              // theme === "blue" && "to-purple-600",
              // theme === "green" && "to-emerald-600",
              // theme === "red" && "to-rose-600",
              // theme === "yellow" && "to-yellow-600",
              // theme === "violet" && "to-violet-600",
              // theme === "gray" && "to-gray-600",
              // theme === "neutral" && "to-neutral-600",
              // theme === "slate" && "to-slate-600",
              // theme === "stone" && "to-stone-600",
              // theme === "zinc" && "to-zinc-600",
              // theme === "rose" && "to-pink-600"
            )}
          >
            Simplified.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="text-base text-muted-foreground lg:text-lg"
        >
          Empowering <span className="text-primary">open-source</span>{" "}
          maintainers with direct blockchain-based donations.
          <span className="hidden lg:block">
            Support innovation and sustainability in open-source development
            with us.
          </span>
        </motion.p>
        <Form {...form}>
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-end w-full max-w-sm mx-auto mt-4 space-y-2"
          >
            <div className="flex w-full max-w-sm flex-col items-start gap-3  ">
              <Label
                className="text-left text-muted-foreground text-xl"
                htmlFor="repo"
              >
                Start contributing today !!!
              </Label>

              <FormField
                control={form.control}
                defaultValue=""
                name="repo"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Input
                      id="repo"
                      type="text"
                      placeholder="https://github.com/emee-dev/treblle-monorepo"
                      {...field}
                      {...form.register("repo", {
                        required: "Please provide a valid github link",
                      })}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {
              <Button
                className={cn("flex w-full justify-center gap-3")}
                type="submit"
                disabled={isPending}
              >
                {isPending && <Loader2Icon className="w-4 h-4 animate-spin" />}
                {isPending && "Verifying"}
                {!isPending && "Donate to project"}
                {!isPending && <MoveRightIcon className="w-4 h-4" />}
              </Button>
            }
            {/* {state.succeeded && (
          <Button variant={"secondary"} className="w-full pointer-events-none">
            You've successfully joined the waitlist! 🔥
          </Button>
        )} */}
            {
              <p className="w-full text-sm text-center text-muted-foreground">
                Join a waitlist of 200+ maintainers!
              </p>
            }

            <p className="w-full text-sm text-center text-muted-foreground"></p>
          </motion.form>
        </Form>
        {theme !== "rose" &&
          theme !== "green" &&
          theme !== "orange" &&
          theme !== "blue" &&
          theme !== "yellow" && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 0.3,
              }}
              className="mx-auto h-56 w-[1px] rounded-full  bg-gradient-to-b from-transparent to-primary"
            ></motion.span>
          )}
        {theme === "rose" && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
            className="mx-auto"
          >
            <Flower
              className="h-56 rotate-180"
              linearFrom="text-primary"
              linearTo="text-primary/10"
            />
          </motion.span>
        )}
        {theme === "green" && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
            className="mx-auto"
          >
            <Swirl
              className="h-56"
              linearFrom="text-primary/10"
              linearTo="text-primary"
            />
          </motion.span>
        )}
        {theme === "orange" && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
            className="mx-auto"
          >
            <Fire
              className="h-56"
              linearFrom="text-primary/10"
              linearTo="text-primary"
            />
          </motion.span>
        )}
        {theme === "yellow" && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
            className="mx-auto"
          >
            <Lightning
              className="h-56"
              linearFrom="text-primary/10"
              linearTo="text-primary"
            />
          </motion.span>
        )}
        {theme === "blue" && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
            className="mx-auto"
          >
            <Anchor
              className="h-56"
              linearFrom="text-primary/10"
              linearTo="text-primary"
            />
          </motion.span>
        )}
      </LazyMotion>
    </main>
  );
};

export default Hero;
