import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DARK_THEME_CLASS = "dark";
export function isDarkTheme() {
  const root = document.getElementById("root");
  return root?.className === DARK_THEME_CLASS;
}

export function toggleTheme() {
  const root = document.getElementById("root");
  if (!root) return;

  root.className = root.className === DARK_THEME_CLASS ? "" : DARK_THEME_CLASS;
}
