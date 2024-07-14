"use client";
import { create } from "zustand";
import { type ThemeName, themes } from "@/registry/themes";

type Web3Account = {
  address: string;
  balance: number;
};

type State = {
  theme: ThemeName;
  account: Web3Account | null;
};

// Zustand store for theme management
interface Methods {
  setTheme: (theme: ThemeName) => void;
  setAccountInfo: (account: Web3Account) => void;
}

// Utility function to apply the theme
const applyTheme = (theme: ThemeName) => {
  const root = document.documentElement;
  const themeObject = themes.find((t) => t.name === theme);
  if (!themeObject) return;

  Object.keys(themeObject.cssVars.dark).forEach((property) => {
    // @ts-expect-error
    root.style.setProperty(`--${property}`, themeObject.cssVars.dark[property]);
  });
};

const useThemeStore = create<State & Methods>((set) => ({
  theme:
    (typeof window !== "undefined" &&
      (localStorage.getItem("theme") as ThemeName)) ||
    "orange",
  account: null,
  setTheme: (theme: ThemeName) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
    applyTheme(theme);
    set({ theme });
  },
  setAccountInfo: (account: Web3Account) => {
    set({ account });
  },
}));

// Hook to get and set the theme
export default function useTheme(): [ThemeName, (theme: ThemeName) => void] {
  const { theme, setTheme } = useThemeStore();
  return [theme, setTheme];
}

export function useContext() {
  let { account, setAccountInfo } = useThemeStore();

  return [account, setAccountInfo] as const;
}
