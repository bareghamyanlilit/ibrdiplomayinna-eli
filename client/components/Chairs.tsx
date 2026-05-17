"use client";

import { useLanguage } from "@/context/LangContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { H2 } from "./title";

export function Chairs() {
  const { data } = useLanguage();
  return (
    <div className="">
      <H2
        txt={data.staff.chairs.title}
        className=" text-center font-bold  my-5 sm:my-8"
      ></H2>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10  justify-self-center">
        {data.staff.chairs.chairsInStaff.map((e, i) => {
          return (
            <div
              key={i}
              className="flex flex-col  w-[250px] sm:w-[400px] border-0 shadow-xl rounded-2xl p-10 text-center justify-between items-center gap-2"
            >
              <Image
                src={e.img}
                alt={e.title}
                width={90}
                height={90}
                className="object-contain sm:w-30 sm:h-30"
              />
              <h3 className=" text-sm sm:text-2xl font-semibold">{e.title}</h3>
              <Link
                href={`/chairs/${i}`}
                className=" text-base sm:text-xl text-[#004471] border-1 border-[#004471] rounded px-3 py-1 "
              >
                {e.linkTxt}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}