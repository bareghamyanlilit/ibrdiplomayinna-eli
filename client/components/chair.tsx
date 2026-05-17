"use client";

import {P} from "@/components/descr";
import Image from "next/image";
import { useLanguage } from "@/context/LangContext";

export  function Chair({ id }: { id: number }) {
  const { data } = useLanguage();
  const chair = data.staff.chairs.chairs[id];

  return (
    <div className="container w-[90%] sm:w-[80%] mx-auto ">
      <div className=" flex flex-col gap-3 sm:gap-20 justify-around my-5 ">
        <div className=" grid gap-5">
          <div className=" justify-items-center">
            <h3 className="text-center font-bold text-base sm:text-2xl mb-4">
              {chair.title}
            </h3>
            <P
              txt={chair.descr}
              className="max-w-[1000px] text-justify whitespace-pre-line "
            />
          </div>
          <div className="sm:flex justify-center my-10">
            <div className=" flex flex-col items-center gap-0 sm:gap-2">
              <Image
                src={chair.boss.src}
                alt={chair.boss.name}
                width={300}
                height={300}
                className="object-cover  h-[300px]"
              />
              <h1 className="font-bold text-base">{chair.boss.name}</h1>
              <p>{chair.boss.descr}</p>
            </div>
            <div className="my-5 sm:mx-30">
              <p className="my-2 txet-base sm:text-2xl  text-black">
                {data.staff.chairs.subTitle}
              </p>
              {chair.staff.map((elem, i) => (
                <P txt={elem} key={i} className="my-1"></P>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}