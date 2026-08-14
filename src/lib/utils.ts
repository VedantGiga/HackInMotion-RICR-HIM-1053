import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrencySymbol(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("user_currency");
    if (saved === "USD") return "$";
    if (saved === "EUR") return "€";
    if (saved === "GBP") return "£";
    if (saved === "CAD") return "$";
    if (saved === "AUD") return "$";
    if (saved === "AED") return "AED ";
    if (saved === "SGD") return "$";
  }
  return "₹";
}
