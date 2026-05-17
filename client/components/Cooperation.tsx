// Gorcunkereri (Partners) ej — static data-ic nkarer ev nkaragrutyunner
"use client";

import { useLanguage } from "@/context/LangContext";
import Image from "next/image";
import { H2 } from "./title";
import { P } from "./descr";

export function Cooperation() {
  const { data } = useLanguage();
  return (
    <div className="  container w-[90%] sm:w-[80%] mx-auto">
      {/* Գործընկերներ */}
      <div className="px-4 md:px-8 py-8">
        <H2 txt={data.aboutInfo.partnersPartTitle} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.aboutInfo.partners.map((e, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center"
            >
              <Image
                src={e.img}
                alt={e.descr}
                width={96}
                height={96}
                className="object-contain mb-4"
              />
              <P txt={e.descr} className="font-semibold" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
