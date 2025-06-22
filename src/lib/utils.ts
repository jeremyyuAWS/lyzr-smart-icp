import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
  return `${Math.round(score * 100)}%`
}

export function getScoreColor(score: number): string {
  if (score >= 0.8) return "text-emerald-600"
  if (score >= 0.6) return "text-blue-600"
  if (score >= 0.4) return "text-amber-600"
  return "text-red-600"
}

export function getScoreBadgeColor(score: number): string {
  if (score >= 0.8) return "bg-emerald-100 text-emerald-800"
  if (score >= 0.6) return "bg-blue-100 text-blue-800"
  if (score >= 0.4) return "bg-amber-100 text-amber-800"
  return "bg-red-100 text-red-800"
}