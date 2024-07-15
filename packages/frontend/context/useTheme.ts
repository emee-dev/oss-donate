import { create } from "zustand";
import { type ThemeName, themes } from "@/registry/themes";

export type ThemeState = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

// Utility function to apply the theme
export const applyTheme = (theme: ThemeName) => {
  const root = document.documentElement;
  const themeObject = themes.find((t) => t.name === theme);
  if (!themeObject) return;

  Object.keys(themeObject.cssVars.dark).forEach((property) => {
    // @ts-expect-error
    root.style.setProperty(`--${property}`, themeObject.cssVars.dark[property]);
  });
};

export const createThemeSlice = (set: any): ThemeState => ({
  theme:
    (typeof window !== "undefined" &&
      (localStorage.getItem("theme") as ThemeName)) ||
    "orange",
  setTheme: (theme: ThemeName) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
    applyTheme(theme);
    set({ theme });
  },
});
