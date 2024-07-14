"use client";

import { useState } from "react";

type LocalStorageKey = "ossdonate.social.claim" | "ossdonate.social.verify";

function useLocalStorage() {
  const [storedValue, setStoredValue] = useState<any>(null);

  const setValue = <T,>(key: LocalStorageKey, value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value, null, 3));
      return true;
    } catch (error) {
      console.error("Error setting localStorage key “" + key + "”: ", error);
      return false;
    }
  };

  const getValue = (key: LocalStorageKey) => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
        return true;
      }
    } catch (error) {
      console.error(
        "Error initializing localStorage key “" + key + "”: ",
        error
      );
      return false;
    }
  };

  return { storedValue, setValue, getValue } as const;
}

export default useLocalStorage;
