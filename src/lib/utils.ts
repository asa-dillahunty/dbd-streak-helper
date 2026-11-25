import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isDarkTheme() {
  return document.documentElement.classList.contains("dark");
}

export function toggleTheme() {
  return document.documentElement.classList.toggle("dark");
}
