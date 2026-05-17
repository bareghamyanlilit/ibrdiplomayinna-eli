// Reusable <P> component — paragraphi hamar responsiv text dimensianerov
// cn() utility-y mergvum e default class-ery user-i className-ov
import { cn } from "@/utils/utils";
import React from "react";
type PProps = {
  txt: string;
  className?: string;
};

export function P({ className, txt }: PProps) {
  return <p className={cn("text-sm sm:text-base 2xl:text-lg text-[#1a1a1a]", className)}>{txt}</p>;
}
