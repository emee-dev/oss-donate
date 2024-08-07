"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useContext } from "@/hooks/useTheme";
import { CONTRACT_ADDRESS, tempJson } from "@/providers/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LazyMotion, domAnimation, m as motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCheck,
  Github,
  Pencil,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";
import { GithubResponse } from "../../api/route";
import { useWeb3Context } from "@/context";
import abi from "@/artifacts/contracts/OSSFunding.sol/OSSFunding.json";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { useToast } from "@/components/ui/use-toast";

const STABLE_TOKEN_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

const CopyIcon = dynamic(() => import("@/components/icons/copy"));

type Json = {
  ossdonate: {
    celo: {
      ownedBy: string;
    };
  };
};

type GithubApi = {
  github: GithubResponse | null;
  success: boolean;
};

type ComponentProps = {
  params: {};
  searchParams: { repo: string | null };
};

const VerifyModal = (props: ComponentProps) => {
  let { account, setAccountRepo } = useWeb3Context();
  let [object, setObject] = useState<string>("");
  const { copied, copyToClipboard } = useCopyToClipboard();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (props.searchParams.repo) {
      setAccountRepo(props.searchParams.repo);
    } else {
      router.push("/repo/claim");
    }
  }, []);

  const {
    data: hash,
    isPending: writeIsPending,
    isError: writeIsError,
    error: writeError,
    writeContractAsync,
  } = useWriteContract();

  useEffect(() => {
    console.log(account);

    if (writeError) {
      toast({
        title: "Oops Application error",
        description: writeError.message,
        variant: "destructive",
        // action: (
        //   <Link>
        //     <ToastAction altText="Reciept">Account topup</ToastAction>
        //   </Link>
        // ),
      });
    }
  }, [writeIsError, writeError]);

  const { data, isPending, isError, mutate } = useMutation<
    GithubResponse,
    null,
    { github_repo: string }
  >({
    mutationKey: ["verify_project"],
    mutationFn: async (payload) => {
      try {
        console.log(payload);
        let isOwner = await axios.post("/api", payload);

        console.log(isOwner);

        let res = isOwner.data as GithubResponse;

        if (
          account &&
          account?.ownAddress === res.funding_file.ossdonate.celo.ownedBy
        ) {
          router.push(`/repo/maintainer?repo=${payload.github_repo}`);
          return Promise.resolve(res.github_repo);
        }

        let registerProject = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: abi["abi"],
          functionName: "registerProject",
          args: [account?.repo, account?.ownAddress!],
        });

        return Promise.resolve<any>({
          // funding_file: {
          //   ossdonate: {
          //     celo: {
          //       ownedBy: account?.ownAddress! as string,
          //     },
          //   },
          // },
          message: "Project registered successfully.",
        });
      } catch (e: any) {
        return Promise.reject(e.message);
      }
    },
  });

  useEffect(() => {
    if (account?.ownAddress) {
      let json = {
        ossdonate: {
          celo: { ownedBy: account?.ownAddress },
        },
      } as Json;

      let str = JSON.stringify(json, null, 3);
      setObject(str);
    } else {
      setObject(JSON.stringify(tempJson, null, 3));
    }
  }, [account]);

  const handleSubmit = (ev: SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    ev.stopPropagation();

    const form = new FormData(ev.currentTarget);

    // let value = form.get("repo") as string;

    // console.log(account?.repo);

    if (!account?.repo) {
      router.push("/repo/claim");
      return;
    }

    mutate({ github_repo: account.repo!.toLowerCase() });
  };

  return (
    <LazyMotion features={domAnimation}>
      <Card className="w-full max-w-lg font-mono">
        <CardHeader>
          <CardTitle className="text-2xl">Verify your project</CardTitle>
          <CardDescription>
            Verify you are the owner of this project, Add a FUNDING.json file
            with your Ethereum address to the default branch of your repository
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
          <CardContent className="w-full">
            <div className="w-full">
              <div className="flex items-center py-3 gap-3">
                <Input
                  id="repo"
                  type="text"
                  readOnly
                  value={account?.repo}
                  placeholder="https://github.com/<org>/<repo>.git"
                />
                <motion.div>
                  <Link href="/repo/claim">
                    <Button
                      className="bg-transparent hover:bg-transparent"
                      type="button"
                      size="icon"
                    >
                      <Pencil size={18} strokeWidth={0.75} />
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {!isError && (
                <motion.div
                  className="h-fit w-full lg:max-w-[29rem] rounded-md border pb-3 justify-center flex flex-col gap-3"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <div className="bg-[#6d3aff] text-white flex items-center justify-between h-9 p-2 w-full rounded-tl-lg rounded-tr-lg">
                    <span className="text-sm">./FUNDING.json</span>
                    <Button
                      className="bg-transparent hover:bg-transparent"
                      type="button"
                      size="icon"
                      onClick={() => copyToClipboard(object)}
                    >
                      {!copied && <CopyIcon className="w-4 h-4" />}
                      {copied && <CheckCheck className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="p-4 bg-neutral-100 text-gray-800 overflow-x-scroll no-scrollbar rounded-sm">
                    <pre>{object}</pre>
                  </div>

                  <div className="flex items-center pl-2 gap-3">
                    <Checkbox
                      id="terms"
                      className="border border-[#6d3aff] data-[state=checked]:bg-[#6d3aff]"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I added the FUNDING.json file to the root of my repo.
                    </label>
                  </div>
                </motion.div>
              )}

              {isError && !data && (
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
                      <span className="text-primary/75">{"Ops"} / </span>
                      <span className="text-neutral-400">
                        {"Could not verify project ownership"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="w-40" type="button">
              <ArrowLeft size={18} className="mr-3" /> Back
            </Button>

            {!isPending && (
              <Button className="w-40" type="submit">
                <BadgeCheck size={18} className="mr-3" /> Verify Now
              </Button>
            )}

            {isPending && (
              <Button className="w-40" type="submit">
                <BadgeCheck size={18} className="mr-3" /> Verifying
              </Button>
            )}
          </CardFooter>
        </motion.form>
      </Card>
    </LazyMotion>
  );
};

export default VerifyModal;
