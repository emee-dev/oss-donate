import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="w-full max-w-lg mx-2 font-mono">
      <div>
        <Skeleton className="text-2xl" />
        <Skeleton />
      </div>

      <div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center py-4 gap-3 animate-in">
              <Skeleton className="w-full" />
            </div>

            <div className="h-fit w-full rounded-md border pb-3 px-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 mt-2">
                <Skeleton className="rounded-full bg-primary/35 w-[40px] h-[40px] flex justify-center items-center" />
                <div className="tracking-tight">
                  <span className="text-primary/75">{"repo"} / </span>
                  <span className="text-neutral-400">
                    {"git clone link" + ".git"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 lg:mt-0 mt-4">
                <span className="leading-5 tracking-tight text-neutral-200">
                  CLAIMABLE TOKENS
                </span>
                <div className="flex">
                  <span className="text-neutral-400">NONE</span>

                  <div className="py-3 ml-auto">Claim</div>
                </div>
              </div>
            </div>

            {/* {isError && (
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
              )} */}
          </div>
        </div>

        <div className="flex">
          <div className="w-full">
            <Skeleton className="w-full h-9"></Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
