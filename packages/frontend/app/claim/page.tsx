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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import useDebouncedInput from "@/hooks/useDebouncedInput";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useContext } from "@/hooks/useTheme";
import { convertCusdtoNaira } from "@/lib/crypto";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LazyMotion, domAnimation, m as motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  BadgeCheck,
  CheckCheck,
  Github,
  Loader,
  Pencil,
} from "lucide-react";
import dynamic from "next/dynamic";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { GithubResponse } from "../api/route";
import Link from "next/link";

const STABLE_TOKEN_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

// import Celo from "@/components/icons/celo";
// import CopyIcon from "@/components/icons/copy";
// import Naira from "@/components/icons/naira";
// import Usdt from "@/components/icons/usdt";

const Celo = dynamic(() => import("@/components/icons/celo"));
const CopyIcon = dynamic(() => import("@/components/icons/copy"));

let coins = [
  {
    symbol: "Cusd",
    slug: "cusd",
    icon: <Celo className="w-5 h-5" />,
  },
];

type ModelProgress = "claim" | "verify" | "donate";

const tempJson = {
  ossdonate: {
    celo: {
      ownedBy: "0x0000000000000000000000000000000000000000",
    },
  },
};

type Json = {
  ossdonate: {
    celo: {
      ownedBy: string;
    };
  };
};

type ClaimAction = { params: {}; searchParams: { action: ModelProgress } };

type Props = {
  isLoading: boolean;
  handleSubmit: (val: any) => void;
};

type GithubApi = {
  github: GithubResponse;
  success: boolean;
};

const ClaimProject = (props: ClaimAction) => {
  let modelProgress = props.searchParams.action;
  let { address, status } = useAccount();
  let [account, setAccountInfo] = useContext();

  const { connect } = useConnect();

  useEffect(() => {
    if (window.ethereum) {
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  useEffect(() => {
    if (address) {
      // @ts-expect-error
      setAccountInfo({ address });
    }
  }, [address]);

  // if(!account) {
  //   return
  // }

  return (
    <div className="flex flex-1 bg-muted h-screen justify-center items-center font-mono">
      {modelProgress === "claim" && <ClaimModal />}

      {modelProgress === "verify" && <VerifyProject />}

      {modelProgress === "donate" && <DonationCard />}

      {!modelProgress && <ClaimModal />}
    </div>
  );
};

const ClaimModal = (props: Partial<Props>) => {
  let [account, setAccountInfo] = useContext();

  const {
    data: hash,
    error,
    isPending: contractCallPending,
    writeContract,
  } = useWriteContract();

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

        if (!data || req.status !== 200) {
          return Promise.reject(null);
        }

        console.log("Github repo", data);

        return Promise.resolve({
          github: data,
          success: true,
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

              {data && data.success && (
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
                            functionName: "registerProject",
                            args: [
                              "https://github.com/emee-dev/treblle-monorepo",
                              account?.address as `0x${string}`,
                            ],
                          });
                        }}
                      >
                        {contractCallPending && "Claiming"}
                        {!contractCallPending && "Claim"}
                      </Button>
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
            {!isError && (
              <Button className="w-40 ml-auto" type="submit">
                <ArrowRight size={18} className="mr-3" /> Continue
              </Button>
            )}

            {isError && (
              <Button className="w-40 ml-auto" type="submit">
                <ArrowRight size={18} className="mr-3" /> Retry
              </Button>
            )}
          </CardFooter>
        </motion.form>
      </Card>
    </LazyMotion>
  );
};

type VerifyGithub = { github_repo: string };

const VerifyProject = (props: Partial<Props>) => {
  let [account, setAccountInfo] = useContext();
  let [object, setObject] = useState<string>("");
  const { getValue, setValue } = useLocalStorage();
  const { copied, copyToClipboard } = useCopyToClipboard();

  const { data, isPending, isError, mutate } = useMutation<
    GithubResponse,
    null,
    { github_repo: string }
  >({
    mutationKey: ["verify_project"],
    mutationFn: async (payload) => {
      try {
        let isOwner = await axios.post("/api", payload);

        if (!isOwner) {
          return Promise.reject("Invalid github repo");
        }

        let res = isOwner.data as GithubResponse;

        if (
          account &&
          account?.address === res.funding_file.ossdonate.celo.ownedBy
        ) {
          return Promise.resolve(res);
        }

        return Promise.resolve(isOwner.data);
      } catch (e: any) {
        return Promise.reject(e.message);
      }
    },
  });

  useEffect(() => {
    if (account?.address) {
      let json = {
        ossdonate: {
          celo: { ownedBy: account?.address },
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

    let value = form.get("repo") as string;

    mutate({ github_repo: value });
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
                  placeholder="https://github.com/emee-dev/treblle-monorepo.git"
                />
                <motion.div>
                  <Link href="/claim?action=claim">
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
                      <span className="text-primary/75">{"Ops"} / </span>
                      <span className="text-neutral-400">
                        {"Could verify project ownership"}
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

type Coins = "ngn" | "cusd";
type CusdProp = { cusdAmt: number };

function DonationCard(props: any) {
  let isError = false;
  const { setValue: setLocal } = useLocalStorage();
  let [inputvalue, setInputvalue] = useState<number>(5);
  let [currentCoin, setCurrentCoin] = useState<Coins>("cusd");
  let { debouncedValue, setValue } = useDebouncedInput({ seconds: 500 });
  const { writeContract, writeContractAsync } = useWriteContract();

  const {
    data: basePrice,
    isPending,
    mutate: checkBasePrice,
  } = useMutation<number | null, null, CusdProp>({
    mutationKey: ["price_check"],
    mutationFn: async (payload) => {
      try {
        let data = await convertCusdtoNaira(payload.cusdAmt);

        console.log("base", data);

        return Promise.resolve(Math.floor(data));
      } catch (e) {
        return Promise.reject(null);
      }
    },
  });

  const { data, mutate } = useMutation<string | null, null, CusdProp>({
    mutationKey: ["price_compare"],
    mutationFn: async (payload) => {
      try {
        let data = await convertCusdtoNaira(payload.cusdAmt);

        console.log("compare", data);

        return Promise.resolve(data.toFixed(2));
      } catch (e) {
        return Promise.reject(null);
      }
    },
  });

  const convertCusdToNgn = (cusdAmt: number) => mutate({ cusdAmt });

  // useEffect(() => {
  //   checkBasePrice({ cusdAmt: 1 });
  //   convertCusdToNgn(inputvalue);
  // }, []);

  // useEffect(() => {
  //   if (debouncedValue) {
  //     convertCusdToNgn(debouncedValue);
  //   }
  // }, [debouncedValue]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.valueAsNumber;
    if (!value || value <= 0) {
      setInputvalue(1);
      return;
    }
    setValue(value); // debounced value
    setInputvalue(value);
  };

  const handleSubmit = async (ev: SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    ev.stopPropagation();

    const form = new FormData(ev.currentTarget);

    let value = form.get("currentCoin") as string;

    console.log(value);

    await writeContractAsync({
      abi: abi,
      address: "0x",
      functionName: "contributeToProject",
      args: ["", "0x"],
    });
  };

  return (
    <div className="max-w-lg w-[390px] md:w-[500px] mx-auto bg-background rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Donate with Crypto</h2>
      <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
        <div
          className={`border rounded-md p-2 md:p-4 flex flex-col ${
            isError && "border-primary"
          }`}
        >
          <label
            htmlFor="amount"
            className="block font-medium mb-2 text-muted-foreground"
          >
            Donation Amount
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                id="amount"
                type="number"
                name="currentCoin"
                min={0}
                value={inputvalue}
                onChange={(e) => onInputChange(e)}
                placeholder="Enter amount"
                className="w-full remove-arrow"
              />
            </div>
            <div className="w-1/3">
              <Select defaultValue={currentCoin}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {coins.map((coin) => {
                    return (
                      <SelectItem value={coin.slug} key={crypto.randomUUID()}>
                        <div className="flex gap-2">
                          {coin.icon}
                          <span>{coin.symbol.toUpperCase()}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-2">
            {isError && (
              <p className="text-primary text-sm ">
                Please enter a valid amount.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowUpDown size={18} />
        </div>

        <div>
          <p className="font-medium mb-2">Equivalent in Fiat</p>
          <div className="bg-muted px-3 py-2 rounded-md flex-1">
            <span className="text-2xl font-semibold">{data || "0.0000"}</span>
            <span className="text-muted-foreground text-sm"> NGN</span>
          </div>
          <div className="text-xs text-muted-foreground mt-2 flex items-center">
            1 CUSD ≈ {basePrice || "0.000"} NGN{" "}
            <motion.div className="w-4">
              {isPending && <Loader className="size-4 animate-spin ml-3" />}
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            *Conversion rate from CoinGecko API
          </p>
        </div>
        <Button className="w-full" type="submit">
          Donate
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Powered By{" "}
          <span className="font-bold text-neutral-50">OSSDonate</span>
        </p>
      </form>
    </div>
  );
}

export default ClaimProject;
