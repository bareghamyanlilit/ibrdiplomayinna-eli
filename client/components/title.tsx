// Reusable <H2> component — vercnagrer hamar responsiv styling ev kentrirman
// cn() utility-y mergvum e default ev user class-ery
import { cn } from "@/utils/utils";
import React from "react";
type H2Props = {
  txt: string;
  className?: string;
};

export function H2({ className, txt }: H2Props) {
  return <h2 className={cn("text-base sm:text-2xl 2xl:text-3xl text-[#004471] font-bold text-center m-10", className)}>{txt}</h2>;
}
