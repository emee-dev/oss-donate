"use client";

import abi from "@/abi/sample";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useContext } from "@/hooks/useTheme";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LazyMotion, domAnimation, m as motion } from "framer-motion";
import { ArrowRight, Github, Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { SyntheticEvent } from "react";
import { readContract } from "@wagmi/core";

import { GithubResponse } from "../../api/route";
import { useReadContract, useWriteContract } from "wagmi";
import { config } from "@/providers/constants";

const STABLE_TOKEN_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

type Json = {
  ossdonate: {
    celo: {
      ownedBy: string;
    };
  };
};

type GithubApi = {
  github: GithubResponse | null;
  file: "missing" | "found";
};

const ClaimModal = () => {
  let [account, setAccountInfo] = useContext();

  const {
    data: hash,
    isPending: contractIsPending,
    writeContract,
  } = useWriteContract();

  //   const read = useReadContract();

  const { data, isPending, isError, mutate } = useMutation<
    GithubApi,
    null,
    { github_repo: string }
  >({
    mutationKey: ["claim_project"],
    mutationFn: async (payload) => {
      try {
        let req = await axios.post("/api", payload);

        let data = req.data as GithubResponse;

        console.log(data);

        if (!data) {
          return Promise.reject(null);
        }

        if (!data.funding_file) {
          return Promise.resolve({ github: null, file: "missing" });
        }

        // @ts-expect-error
        let balance = await readContract(config, {
          abi,
          address: "0x6b175474e89094c44da98b954eedeac495271d0f",
          functionName: "getProjectMaintainer",
          args: [payload.github_repo],
        });

        console.log("balance", balance);

        return Promise.resolve({
          github: data,
          file: "found",
        });
      } catch (e: any) {
        return Promise.reject(e.message);
      }
    },
  });

  const handleSubmit = (ev: SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    ev.stopPropagation();

    const form = new FormData(ev.currentTarget);
    let value = form.get("repo") as string;

    mutate({ github_repo: value });
  };

  return (
    <LazyMotion features={domAnimation}>
      <Card className="w-full max-w-lg mx-2 font-mono">
        <CardHeader>
          <CardTitle className="text-2xl">Claim your project</CardTitle>
          <CardDescription>
            Enter your project's Github URL to see if it has a claimable funds.
            Your repositoory must be public
          </CardDescription>
        </CardHeader>

        <motion.form
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.4,
          }}
          onSubmit={handleSubmit}
        >
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center py-4 gap-3 animate-in">
                <Input
                  id="repo"
                  name="repo"
                  type="text"
                  autoFocus
                  placeholder="https://github.com/emee-dev/treblle-monorepo.git"
                  required
                />

                <motion.div className="w-6">
                  {isPending && <Loader className="size-5 animate-spin" />}
                </motion.div>
              </div>

              {data && data.github && data.file === "found" && (
                <motion.div
                  className="h-fit w-full rounded-md border pb-3 px-4 flex flex-col gap-3"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <div className="flex items-center gap-3 mt-2">
                    <div className="rounded-full bg-primary/35 w-[40px] h-[40px] flex justify-center items-center">
                      <Github size={25} strokeWidth={0.95} />
                    </div>
                    <div className="tracking-tight">
                      <span className="text-primary/75">
                        {data.github.github_repo.owner} /{" "}
                      </span>
                      <span className="text-neutral-400">
                        {data.github.github_repo.repo + ".git"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:mt-0 mt-4">
                    <span className="leading-5 tracking-tight text-neutral-200 ">
                      CLAIMABLE TOKENS
                    </span>
                    <div className="flex">
                      <span className="text-neutral-400">NONE</span>

                      <Button
                        size="sm"
                        variant={"outline"}
                        type="button"
                        className="py-3 ml-auto"
                        onClick={() => {
                          writeContract({
                            address:
                              "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
                            abi: abi,
                            functionName: "liquidateProject",
                            args: [
                              "https://github.com/emee-dev/treblle-monorepo",
                              account?.address as `0x${string}`,
                            ],
                          });
                        }}
                      >
                        {contractIsPending && "Claiming"}
                        {!contractIsPending && "Claim"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {data && !data.github && (
                <motion.div
                  className="h-fit w-full rounded-md border pb-3 px-4 flex flex-col gap-3"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <div className="flex items-center gap-3 mt-2">
                    <div className="rounded-full bg-primary/35 w-[40px] h-[40px] flex justify-center items-center">
                      <Github size={25} strokeWidth={0.95} />
                    </div>
                    <div className="tracking-tight">
                      <span className="text-primary/75">{"Error"} / </span>
                      <span className="text-neutral-400">
                        {"Missing FUNDING.json file in main branch"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {isError && (
                <motion.div
                  className="h-fit w-full rounded-md border pb-3 px-4 flex flex-col gap-3"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <div className="flex items-center gap-3 mt-2">
                    <div className="rounded-full bg-primary/35 w-[40px] h-[40px] flex justify-center items-center">
                      <Github size={25} strokeWidth={0.95} />
                    </div>
                    <div className="tracking-tight">
                      <span className="text-primary/75">{"Error"} / </span>
                      <span className="text-neutral-400">
                        {"Could not resolve project"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex">
            {!isError && !data && (
              <Button className="w-40 ml-auto" type="submit">
                <ArrowRight size={18} className="mr-3" /> Continue
              </Button>
            )}

            {isError && (
              <Button className="w-40 ml-auto" type="submit">
                <ArrowRight size={18} className="mr-3" /> Retry
              </Button>
            )}

            {!isError && data && data.file === "missing" && (
              <Button className="w-40 ml-auto" type="submit">
                <ArrowRight size={18} className="mr-3" /> Claim project
              </Button>
            )}
          </CardFooter>
        </motion.form>
      </Card>
    </LazyMotion>
  );
};

export default ClaimModal;
