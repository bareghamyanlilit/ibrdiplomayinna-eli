import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// CSS class-eri hamatenghum ev Tailwind conflict-neri luzum (cn utility)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Texty mets tarrovic sksnenq
export function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

// Asinxron qacharakutyun (sleep utility millisekund-nerov)
  export async function sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
