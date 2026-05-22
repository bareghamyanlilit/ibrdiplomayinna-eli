'use client'
import Image from 'next/image';
import React from 'react'
import { H2 } from './title';
import { useLanguage } from '@/context/LangContext';
import { P } from './descr';
import { Chairs } from './Chairs';

export function Staff() {
  const { data } = useLanguage();
  return (
    
    <div className="Staff container w-[90%] sm:w-[80%] mx-auto  bg-white">
      <div className="">
        <H2
          txt={data.staff.boss.title}
          className="text-center font-bold  my-5 sm:my-8"
        ></H2>
        <div className="flex flex-wrap  gap-5 sm:gap-0 justify-around my-5">
          {data.staff.boss.info.map((item, i) => (
            <div key={i} className="w-[280px] flex flex-col gap-1 sm:gap-2">
              {item.src != "" ? (
                <Image
                  src={item.src}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="object-cover  h-[300px]"
                />
              ) : null}
              <h1 className="font-bold text-xl">{item.name}</h1>
              <p>{item.descr}</p>
            </div>
          ))}
        </div>
      </div>
      <hr className="border-[#003865] w-[80%] mx-auto border-1 hidden sm:block" />

      <div className=" serviceStaff w-full sm:w-max  mx-auto  px-2 sm:px-10 py-4">
        <div>
          <H2
            txt={data.staff.educationalAid.title}
            className="text-center font-bold  my-5 sm:my-8"
          ></H2>
          <div className="flex flex-col gap-3 sm:gap-0 justify-around my-5 ">
            {data.staff.educationalAid.info.map((item, i) => (
              <div
                key={i}
                className="w-full sm:w-max flex flex-col gap-1 sm:gap-2"
              >
                <P txt={`${item.descr} - ${item.name}`}></P>
              </div>
            ))}
          </div>
        </div>
        <div>
          <H2
            txt={data.staff.serviceStaff.title}
            className="text-center font-bold  my-5 sm:my-8"
          ></H2>
          <div className="flex flex-col gap-3 sm:gap-0 justify-around my-5 ">
            {data.staff.serviceStaff.info.map((item, i) => (
              <div
                key={i}
                className="w-full sm:w-max flex flex-col gap-1 sm:gap-2"
              >
                <P txt={`${item.descr} - ${item.name}`}></P>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Chairs/>

    </div>
  )
}