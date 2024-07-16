// "use client";

// // import abi from "@/abi/sample";
// import abi from "@/artifacts/contracts/OSSFunding.sol/OSSFunding.json";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { useWeb3Context } from "@/context";
// import { useMutation } from "@tanstack/react-query";
// import { readContract } from "@wagmi/core";
// import axios from "axios";
// import { LazyMotion, domAnimation, m as motion } from "framer-motion";
// import { ArrowRight, Github, Loader } from "lucide-react";
// import { SyntheticEvent, useEffect, useState } from "react";

// import { useWriteContract } from "wagmi";
// import { GithubResponse } from "../../api/route";
// // import { config } from "@/providers/client";
// import { CONTRACT_ADDRESS, config } from "@/providers/constants";
// import Link from "next/link";

// type Json = {
//   ossdonate: {
//     celo: {
//       ownedBy: string;
//     };
//   };
// };

// type GithubApi = {
//   github: GithubResponse | null;
//   file: "missing" | "found";
// };

// const ClaimModal = () => {
//   let { account, setAccountRepo } = useWeb3Context();
//   let [projectBalance, setProjectBalance] = useState<string>("");

//   const {
//     data: hash,
//     isPending: contractIsPending,
//     error,
//     writeContract,
//   } = useWriteContract();

//   useEffect(() => {
//     console.log("hash", hash);
//     console.log("error", error?.message);
//   }, [hash, error]);

//   const { data, isPending, isError, mutate } = useMutation<
//     GithubApi,
//     null,
//     { github_repo: string }
//   >({
//     mutationKey: ["claim_project"],
//     mutationFn: async (payload) => {
//       try {
//         let req = await axios.post("/api", payload);

//         let data = req.data as GithubResponse;

//         console.log(data);

//         if (!data) {
//           return Promise.reject(null);
//         }

//         if (!data.funding_file) {
//           return Promise.resolve({ github: null, file: "missing" });
//         }

//         let project = await readContract(config, {
//           abi: abi.abi,
//           address: CONTRACT_ADDRESS,
//           functionName: "getProjectMaintainer",
//           args: [payload.github_repo, account?.ownAddress],
//         });

//         if (!project) {
//           return Promise.resolve({ github: data, file: "found" });
//         }

//         // @ts-expect-error
//         let balance = project[1].toString();

//         setProjectBalance(balance);

//         return Promise.resolve({
//           github: data,
//           file: "found",
//         });
//       } catch (e: any) {
//         return Promise.reject(e.message);
//       }
//     },
//   });

//   const handleSubmit = (ev: SyntheticEvent<HTMLFormElement>) => {
//     ev.preventDefault();
//     ev.stopPropagation();

//     const form = new FormData(ev.currentTarget);
//     let value = form.get("repo") as string;

//     console.log(value);
//     mutate({ github_repo: value });
//     setAccountRepo(value);
//   };

//   return (
//     <LazyMotion features={domAnimation}>
//       <Card className="w-full max-w-lg mx-2 font-mono">
//         <CardHeader>
//           <CardTitle className="text-2xl">Claim your project</CardTitle>
//           <CardDescription>
//             Enter your project's Github URL to see if it has a claimable funds.
//             Your repositoory must be public
//           </CardDescription>
//         </CardHeader>

//         <motion.form
//           initial={{ opacity: 0, y: -10 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{
//             duration: 0.5,
//             ease: "easeOut",
//             delay: 0.4,
//           }}
//           onSubmit={handleSubmit}
//         >
//           <CardContent className="grid gap-4">
//             <div className="grid gap-2">
//               <div className="flex items-center py-4 gap-3 animate-in">
//                 <Input
//                   id="repo"
//                   name="repo"
//                   type="text"
//                   autoFocus
//                   placeholder="https://github.com/emee-dev/treblle-monorepo.git"
//                   required
//                 />

//                 <motion.div className="w-6">
//                   {isPending && <Loader className="size-5 animate-spin" />}
//                 </motion.div>
//               </div>

//               {data && data.github && data.file === "found" && (
//                 <motion.div
//                   className="h-fit w-full rounded-md border pb-3 px-4 flex flex-col gap-3"
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                   viewport={{ once: true, amount: 0.5 }}
//                 >
//                   <div className="flex items-center gap-3 mt-2">
//                     <div className="rounded-full bg-primary/35 w-[40px] h-[40px] flex justify-center items-center">
//                       <Github size={25} strokeWidth={0.95} />
//                     </div>
//                     <div className="tracking-tight">
//                       <span className="text-primary/75">
//                         {data.github.github_repo.owner} /{" "}
//                       </span>
//                       <span className="text-neutral-400">
//                         {data.github.github_repo.repo + ".git"}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-2 lg:mt-0 mt-4">
//                     <span className="leading-5 tracking-tight text-neutral-200 ">
//                       CLAIMABLE TOKENS
//                     </span>
//                     <div className="flex">
//                       <span className="text-neutral-400">
//                         {`${"$ " + projectBalance}` || "NONE"}
//                       </span>

//                       <Button
//                         size="sm"
//                         variant={"outline"}
//                         type="button"
//                         disabled={projectBalance === "0"}
//                         className="py-3 ml-auto"
//                         onClick={() => {
//                           writeContract({
//                             address: CONTRACT_ADDRESS,
//                             abi: abi.abi,
//                             functionName: "liquidateProject",
//                             args: [account?.repo, account?.ownAddress],
//                           });
//                         }}
//                       >
//                         {contractIsPending && "Claiming"}
//                         {!contractIsPending && "Claim"}
//                       </Button>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {data && !data.github && (
//                 <motion.div
//                   className="h-fit w-full rounded-md border pb-3 px-4 flex flex-col gap-3"
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                   viewport={{ once: true, amount: 0.5 }}
//                 >
//                   <div className="flex items-center gap-3 mt-2">
//                     <div className="rounded-full bg-primary/35 w-[40px] h-[40px] flex justify-center items-center">
//                       <Github size={25} strokeWidth={0.95} />
//                     </div>
//                     <div className="tracking-tight">
//                       <span className="text-primary/75">{"Error"} / </span>
//                       <span className="text-neutral-400">
//                         {"Missing FUNDING.json file in main branch"}
//                       </span>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {isError && (
//                 <motion.div
//                   className="h-fit w-full rounded-md border pb-3 px-4 flex flex-col gap-3"
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                   viewport={{ once: true, amount: 0.5 }}
//                 >
//                   <div className="flex items-center gap-3 mt-2">
//                     <div className="rounded-full bg-primary/35 w-[40px] h-[40px] flex justify-center items-center">
//                       <Github size={25} strokeWidth={0.95} />
//                     </div>
//                     <div className="tracking-tight">
//                       <span className="text-primary/75">{"Error"} / </span>
//                       <span className="text-neutral-400">
//                         {"Could not resolve project"}
//                       </span>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </div>
//           </CardContent>

//           <CardFooter className="flex">
//             {!isError && !data && (
//               <Button className="w-40 ml-auto" type="submit">
//                 <ArrowRight size={18} className="mr-3" /> Continue
//               </Button>
//             )}

//             {isError && (
//               <Button className="w-40 ml-auto" type="submit">
//                 <ArrowRight size={18} className="mr-3" /> Retry
//               </Button>
//             )}

//             {!isError && data && data.file === "missing" && (
//               <Link href="repo/verify">
//                 <Button className="w-40 ml-auto" type="submit">
//                   <ArrowRight size={18} className="mr-3" /> Claim project
//                 </Button>
//               </Link>
//             )}

//             {!isError && data && data.file === "found" && (
//               <Link
//                 href={`repo/maintainer?repo=${account?.repo}`}
//                 className="w-full"
//               >
//                 <Button className="w-full " type="submit">
//                   <ArrowRight size={18} className="mr-3" /> Dashboard
//                 </Button>
//               </Link>
//             )}
//           </CardFooter>
//         </motion.form>
//       </Card>
//     </LazyMotion>
//   );
// };

// export default ClaimModal;

"use client";

// import abi from "@/artifacts/contracts/OSSFunding.sol/OSSFunding.json";

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
import { useWeb3Context } from "@/context";
import { useMutation } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import axios from "axios";
import { LazyMotion, domAnimation, m as motion } from "framer-motion";
import { ArrowRight, Github, Loader } from "lucide-react";
import { SyntheticEvent, useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { GithubResponse } from "../../api/route";
import { CONTRACT_ADDRESS, config } from "@/providers/constants";
import Link from "next/link";
import { celo } from "viem/chains";
import abi from "@/abi/sample";

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
  const { account, setAccountRepo } = useWeb3Context();
  const [projectBalance, setProjectBalance] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: hash,
    isPending: contractIsPending,
    error: contractError,
    writeContract,
  } = useWriteContract();

  const { data: balance } = useReadContract({
    abi: abi,
    address: CONTRACT_ADDRESS,
    functionName: "getProjectMaintainer",
    args: [account?.repo!, account?.ownAddress!] as any,
    chainId: celo.id,
  });

  useEffect(() => {
    console.log("balance", balance);

    if (balance) {
      let smcBalance = balance[1].toString();
      setProjectBalance(smcBalance);
    }
    console.log("error", contractError?.message);
  }, [hash, contractError, balance]);

  const { data, isPending, isError, mutate, reset } = useMutation<
    GithubApi,
    Error,
    { github_repo: string }
  >({
    mutationKey: ["claim_project"],
    mutationFn: async (payload) => {
      try {
        let req = await axios.post("/api", payload);
        let data = req.data as GithubResponse;

        if (!data) {
          throw new Error("No data returned from API");
        }

        if (!data.funding_file) {
          return { github: null, file: "missing" };
        }

        // let project = await readContract(config, {
        //   abi: abi,
        //   address: CONTRACT_ADDRESS,
        //   functionName: "getProjectMaintainer",
        //   args: [
        //     payload.github_repo!,
        //     account?.ownAddress! as `0x${string}`,
        //   ] as any,
        // });

        // writeContractAsync({
        //   abi: abi,
        //   address: CONTRACT_ADDRESS,
        //   functionName: "",
        //   args: [
        //     payload.github_repo!,
        //     account?.ownAddress! as `0x${string}`,
        //   ] as any,
        // });

        // if (!project) {
        //   return { github: data, file: "found" };
        // }

        // // @ts-expect-error
        // let balance = project[1].toString();
        // setProjectBalance(balance);

        return {
          github: data,
          file: "found",
        };
      } catch (error: any) {
        setErrorMessage(error.message);
        throw error;
      }
    },
  });

  const handleSubmit = (ev: SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    ev.stopPropagation();

    const form = new FormData(ev.currentTarget);
    let value = form.get("repo") as string;

    console.log(value);
    mutate({ github_repo: value });
    setAccountRepo(value);
    setErrorMessage(null);
  };

  return (
    <LazyMotion features={domAnimation}>
      <Card className="w-full max-w-lg mx-2 font-mono">
        <CardHeader>
          <CardTitle className="text-2xl">Claim your project</CardTitle>
          <CardDescription>
            Enter your project's Github URL to see if it has claimable funds.
            Your repository must be public.
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
                    <span className="leading-5 tracking-tight text-neutral-200">
                      CLAIMABLE TOKENS
                    </span>
                    <div className="flex">
                      <span className="text-neutral-400">
                        {`${"$ " + projectBalance}` || "NONE"}
                      </span>

                      <Button
                        size="sm"
                        variant={"outline"}
                        type="button"
                        disabled={projectBalance === "0"}
                        className="py-3 ml-auto"
                        onClick={() => {
                          writeContract({
                            address: CONTRACT_ADDRESS,
                            abi: abi,
                            functionName: "liquidateProject",
                            args: [account?.repo!, account?.ownAddress!],
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

              {data && !data.github && data.file === "missing" && (
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
                  {errorMessage && (
                    <div className="text-red-500 mt-2">{errorMessage}</div>
                  )}
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
              <Button
                className="w-40 ml-auto"
                type="submit"
                onClick={() => {
                  reset();
                  setErrorMessage(null);
                }}
              >
                <ArrowRight size={18} className="mr-3" /> Retry
              </Button>
            )}

            {!isError && data && data.file === "missing" && (
              <Link href="repo/verify">
                <Button className="w-40 ml-auto" type="submit">
                  <ArrowRight size={18} className="mr-3" /> Claim project
                </Button>
              </Link>
            )}

            {!isError && data && data.file === "found" && (
              <Link
                href={`repo/maintainer?repo=${account?.repo}`}
                className="w-full"
              >
                <Button className="w-full " type="submit">
                  <ArrowRight size={18} className="mr-3" /> Dashboard
                </Button>
              </Link>
            )}
          </CardFooter>
        </motion.form>
      </Card>
    </LazyMotion>
  );
};

export default ClaimModal;
