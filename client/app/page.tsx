// Gnayin ej (/) — hero image + statistics cards
// Hero-n nkary lracnenq brightness-ov text-i hamar
// Stats-y grid-ov render arenq data.homeInfo.stats-ic
"use client";

import Image from "next/image";

import { useLanguage } from "@/context/LangContext";
import {H2} from "@/components/title";

export default function HomePage() {
  const { data } = useLanguage();

  return (
    <div className="HomePage  bg-[#ffffff] ">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh]">
        <div>
          <Image
            src={data.homeInfo.src}
            alt="Քոլեջի պատկերը"
            fill
            className="object-cover  brightness-[0.5] "
            priority
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
            {data.title} <br />
            <span className="text-white">_____________</span>
          </h1>
          <p className="text-white mt-2 text-sm sm:text-lg md:text-xl max-w-2xl">
            {data.homeInfo.descr}
          </p>
        </div>
      </div>
      <div className="w-full sm:py-12">
        <H2
          txt={data.homeInfo.statsTitle}
          className=" mb-10 relative text-2xl"
        ></H2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 place-self-center justify-items-center">
          {data.homeInfo.stats.map((item, i) => (
            <div
              key={i}
              className="bg-[#0a3760] text-white w-64 h-40 flex flex-col items-center justify-center relative"
            >
              <p className="text-3xl font-semibold">{item.number}</p>
              <p className="mt-2">{item.label}</p>
              <div className="absolute bottom-0 left-0 w-full h-[5px] bg-[#a0d4e4]"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
