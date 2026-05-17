"use client"

import { useLanguage } from '@/context/LangContext';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export function Departments() {
    
  const { data } = useLanguage();
  return (
    
    <div className="DepartmentsPage ">
      {/* Hero Section (80vh) */}
      <div className="relative w-full h-[50vh] sm:h-[80vh] mb-6 sm:mb-0">
        <Image
          src={data.departmentsInfo.img}
          alt="Քոլեջի պատկերը"
          fill
          className="object-cover brightness-[0.5] "
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-[600px]">
            <h1 className="text-white text-xl md:text-3xl font-bold leading-snug">
              {data.departmentsInfo.title}
            </h1>
            <p className="text-white mt-2 text-base md:text-xl">
              {data.departmentsInfo.descr}
            </p>
          </div>
        </div>
      </div>


      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5  justify-self-center">
        {data.departmentsInfo.departmentsPartInfo.map((e, i) => {
          return (
            <div key={i} className="flex flex-col  w-[250px] sm:w-[400px] border-0 shadow-xl rounded-2xl p-10 text-center justify-between items-center gap-2">
                <Image
                  src={e.childImg}
                  alt={e.title}
                  width={60}
                  height={60}
                  className="object-contain sm:w-30 sm:h-30"
                />
                <h3 className=" text-sm sm:text-2xl font-semibold">
                  {e.title}
                </h3>
                <Link
                  href={`/departments/${i}`}
                  className=" text-base sm:text-xltext-[#004471] border-1 border-[#004471] rounded px-3 py-1 "
                >
                  {e.linkTxt}
                </Link>
            </div>
          );
        })}
      </div>
    </div>
  )
}