// Hamajvergi vercnagir — logo, desktop/mobile navigation, lezvi kknopper
// isOpen state-y burger menu-i hamar
// setCurrentLang + localStorage.setItem-y pahum en lezvin
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LangContext";
import { NavigationDesktop } from "./navigationDesktop";
import { NavigationMobile } from "./navigationMobile";

export function Header() {
  const { setCurrentLang, data } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="Header sticky h-20 py-3 sm:py-0 sm:h-26 z-50 bg-[#004471] text-white w-full top-0 content-center">
      <div className="relative container mx-auto px-4 sm:px-0">
        <div className="flex justify-between lg:justify-around gap-3 items-center">
          {/* Logo + Title */}
          <Link href={"/"}>
            <div className="flex items-center gap-1 sm:gap-2">
              <Image
                src="/img/logo.png"
                alt="Logo"
                width={60}
                height={60}
                className="w-10 h-10 sm:w-14 sm:h-14"
              />
              <h3 className="font-semibold text-xs md:text-sm 2xl:text-base max-w-[200px] 2xl:max-w-[250px]">
                {data.title}
              </h3>
            </div>
          </Link>

          {/* Burger Icon (mobile) */}
          <button
            className="lg:hidden flex flex-col gap-1 focus:outline-none cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={`block w-6 h-0.5 bg-current transform transition duration-300 ${
                isOpen ? "rotate-45 translate-y-2" : "bg-white"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-current transition duration-300 ${
                isOpen ? "opacity-0" : "opacity-100 bg-white"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-current transform transition duration-300 ${
                isOpen ? "-rotate-45 -translate-y-1" : "bg-white"
              }`}
            ></span>
          </button>

          {/* Navigation (desktop) */}
          <NavigationDesktop headerLinks={data.headerLinks} />

          {/* Languages (desktop) */}
          <div className="hidden lg:flex items-center gap-2 ">
            <button
              onClick={() => {
                setCurrentLang("am");
                localStorage.setItem("lang", "am");
              }}
            >
              <Image
                src={data.lang[0][0]}
                alt={data.lang[0][1]}
                width={35}
                height={20}
                className="w-6 h-4 sm:w-8 sm:h-5 md:w-8 2xl:w-9 md:h-6"
                title={data.lang[0][1]}
              />
            </button>

            <button
              onClick={() => {
                setCurrentLang("ru");
                localStorage.setItem("lang", "ru");
              }}
            >
              <Image
                src={data.lang[1][0]}
                alt={data.lang[1][1]}
                width={35}
                height={20}
                className="w-6 h-4 sm:w-8 sm:h-5 md:w-8 2xl:w-9 md:h-6"
                title={data.lang[1][1]}
              />
            </button>

            <button
              onClick={() => {
                setCurrentLang("en");
                localStorage.setItem("lang", "en");
              }}
            >
              <Image
                src={data.lang[2][0]}
                alt={data.lang[2][1]}
                width={35}
                height={20}
                className="w-6 h-4 sm:w-8 sm:h-5 md:w-8 2xl:w-9 md:h-6"
                title={data.lang[2][1]}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu (dropdown) */}
        <NavigationMobile
          headerLinks={data.headerLinks}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </div>
  );
}
