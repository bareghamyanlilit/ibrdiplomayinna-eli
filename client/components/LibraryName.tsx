// Gradrani anunner mek masnagitvutyunov — static data-ic (id-ov)
// NSHAN: Aystegh console.log(id) mnam e debug hamar — hetagyayum petk e hanel
"use client";
import { useLanguage } from "@/context/LangContext";
import React from "react";
import Image from "next/image";
import img from "@/public/img/library/book.png";

export function LibraryName({ id }: { id: number }) {
  const { data } = useLanguage();
  const libraryName = data.departments[id];
  console.log(id);
  return (
    <div className=" container  w-full sm:w-[80%] mx-auto flex flex-wrap gap-20 justify-center mt-12">
      {libraryName.infoParts.info.map((item, i) => (
          <div key={i}  className=" w-50 flex-col flex  items-center mb-12">
            <Image
              src={img}
              alt="img"
              width={600}
              height={500}
              className="object-cover"
            />
            <h3 className="text-base font-bold mb-3">
              {item.title}
            </h3>
            <button>Ներբեռնել</button>
          </div>
      ))}
    </div>
  );
}
