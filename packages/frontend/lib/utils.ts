"use client";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function urlEncode(str: string) {
  return encodeURIComponent(str);
}

// Function to URL decode a string
export function urlDecode(str: string) {
  return decodeURIComponent(str);
}
