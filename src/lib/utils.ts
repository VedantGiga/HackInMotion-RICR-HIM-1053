import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrencySymbol(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("koshin_currency") || localStorage.getItem("user_currency");
    if (!saved) return "₹";
    if (saved === "₹" || saved === "INR") return "₹";
    if (saved === "$" || saved === "USD") return "$";
    if (saved === "€" || saved === "EUR") return "€";
    if (saved === "£" || saved === "GBP") return "£";
    if (saved === "CAD" || saved === "AUD" || saved === "SGD") return "$";
    if (saved === "AED") return "AED ";
    return saved;
  }
  return "₹";
}
