import { create } from "zustand";
import { ThemeState, createThemeSlice } from "./useTheme";
import { AccountState, createAccountSlice } from "./useAccount";
import { ThemeName } from "@/registry/themes";

const useStore = create<ThemeState & AccountState>((set) => ({
  ...createThemeSlice(set),
  ...createAccountSlice(set),
}));

// Hook to get and set the theme
export function useTheme(): [ThemeName, (theme: ThemeName) => void] {
  const { theme, setTheme } = useStore();
  return [theme, setTheme];
}

// Hook to get and set account information
export function useWeb3Context() {
  const {
    account,
    setAccountInfo,
    setAccountAddress,
    setAccountBalance,
    setAccountRepo,
  } = useStore();
  return {
    account,
    setAccountInfo,
    setAccountAddress,
    setAccountBalance,
    setAccountRepo,
  };
}
