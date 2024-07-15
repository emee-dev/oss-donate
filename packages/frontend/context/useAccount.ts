export type Web3Account = {
  address: `0x${string}`;
  balance: number;
  repo: string;
};

export type AccountState = {
  account: Web3Account | null;
  setAccountInfo: (account: Web3Account) => void;
  setAccountAddress: (address: `0x${string}`) => void;
  setAccountBalance: (balance: number) => void;
  setAccountRepo: (repo: string) => void;
};

export const createAccountSlice = (set: any): AccountState => ({
  account: null,
  setAccountInfo: (account: Web3Account) => {
    set({ account });
  },
  setAccountAddress: (address: `0x${string}`) => {
    set((state: any) => ({
      account: state.account
        ? { ...state.account, address }
        : { address, balance: 0, repo: "" },
    }));
  },
  setAccountBalance: (balance: number) => {
    set((state: any) => ({
      account: state.account
        ? { ...state.account, balance }
        : { address: "0x", balance, repo: "" },
    }));
  },
  setAccountRepo: (repo: string) => {
    set((state: any) => ({
      account: state.account
        ? { ...state.account, repo }
        : { address: "0x", balance: 0, repo },
    }));
  },
});
