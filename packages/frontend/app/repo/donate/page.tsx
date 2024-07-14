"use client";

import abi from "@/abi/sample";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDebouncedInput from "@/hooks/useDebouncedInput";
import useLocalStorage from "@/hooks/useLocalStorage";
import { convertCusdtoNaira } from "@/lib/crypto";
import { useMutation } from "@tanstack/react-query";
import { m as motion } from "framer-motion";
import { ArrowUpDown, Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useWriteContract } from "wagmi";
import { GithubResponse } from "../../api/route";

const STABLE_TOKEN_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

const Celo = dynamic(() => import("@/components/icons/celo"));
const CopyIcon = dynamic(() => import("@/components/icons/copy"));

let coins = [
  {
    symbol: "Cusd",
    slug: "cusd",
    icon: <Celo className="w-5 h-5" />,
  },
];

type Json = {
  ossdonate: {
    celo: {
      ownedBy: string;
    };
  };
};

type ComponentProps = {
  params: {};
  children: React.ReactNode;
};

type GithubApi = {
  github: GithubResponse | null;
  success: boolean;
};

type Coins = "ngn" | "cusd";
type CusdProp = { cusdAmt: number };

function DonationModal(props: ComponentProps) {
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

export default DonationModal;
