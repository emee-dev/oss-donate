export type Web3Account = {
  repo: string;
  balance: number;
  isMaintainer: boolean;
  ownAddress: `0x${string}`;
};

export type AccountState = {
  account: Web3Account | null;
  setAccountInfo: (account: Web3Account) => void;
  setAccountAddress: (address: `0x${string}`) => void;
  setAccountBalance: (balance: number) => void;
  setAccountRepo: (repo: string) => void;
  setIsMaintainer: (value: boolean) => void;
};

export const createAccountSlice = (set: any): AccountState => ({
  account: null,
  setAccountInfo: (account: Web3Account) => {
    set({ account });
  },
  setAccountAddress: (ownAddress: `0x${string}`) => {
    set((state: any) => ({
      account: state.account
        ? { ...state.account, ownAddress }
        : { ownAddress, balance: 0, repo: "" },
    }));
  },
  setAccountBalance: (balance: number) => {
    set((state: any) => ({
      account: state.account
        ? { ...state.account, balance }
        : { ownAddress: "0x", balance, repo: "" },
    }));
  },
  setAccountRepo: (repo: string) => {
    set((state: any) => ({
      account: state.account
        ? { ...state.account, repo }
        : { ownAddress: "0x", balance: 0, repo },
    }));
  },
  setIsMaintainer: (value: boolean) => {
    set((state: any) => ({
      account: state.account
        ? { ...state.account, value }
        : { ownAddress: "0x", balance: 0, value },
    }));
  },
});
