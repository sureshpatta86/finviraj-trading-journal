import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatCurrencySimple(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatPercentage(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function calculatePnL(
  quantity: number,
  entryPrice: number,
  currentPrice: number,
  side: "buy" | "sell"
): number {
  if (side === "buy") {
    return quantity * (currentPrice - entryPrice)
  } else {
    return quantity * (entryPrice - currentPrice)
  }
}

export function calculatePnLPercentage(
  entryPrice: number,
  currentPrice: number,
  side: "buy" | "sell"
): number {
  if (side === "buy") {
    return (currentPrice - entryPrice) / entryPrice
  } else {
    return (entryPrice - currentPrice) / entryPrice
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
