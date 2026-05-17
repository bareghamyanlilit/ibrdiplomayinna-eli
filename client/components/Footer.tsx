// Hamajvergi footer — 3 section (about, contact info, socials)
// copyright + powered by link
// Tvyalnery galis en useLanguage() hook-ic
"use client";
import Image from "next/image";
import { P } from "./descr";
import Link from "next/link";
import { useLanguage } from "@/context/LangContext";
import { H2 } from "./title";

export function Footer() {
  const { data } = useLanguage();
  return (
    <footer className="Footer bg-[#004471] text-white py-10 px-5 font-[Segoe UI, sans-serif] mt-10">
      <div className="container mx-auto flex flex-col md:flex-row flex-wrap justify-around gap-10 text-center md:text-left">
        {/* About / First Info */}
        <div className="flex flex-col gap-4 md:w-[250px]">
          <H2
            txt={data.footer.firstInfo.title}
            className="text-xl text-white sm:text-2xl font-bold"
          />
          <P
            txt={data.footer.firstInfo.descr}
            className="text-white text-sm"
          />
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4 md:w-[250px]">
          <H2
            txt={data.footer.contactInfo.title}
            className=" font-bold text-white"
          />
          <div>
            <P txt={data.footer.contactInfo.loc}  className="text-white"/>
            <P txt={data.footer.contactInfo.phone} className="text-white" />
            <P txt={data.footer.contactInfo.email}  className="text-white "/>
          </div>
        </div>

        {/* Socials */}
        <div className="flex flex-col gap-4 md:w-[200px]">
          <H2
            txt={data.footer.socials.title}
            className=" font-bold text-white"
          />
          <ul className="flex justify-center md:justify-start gap-3">
            {data.footer.socials.socImg.map((item, idx) => (
              <li key={idx}>
                <Link href={item.href}>
                  <Image
                    src={item.src}
                    alt={`social-${idx}`}
                    width={24}
                    height={24}
                    className="hover:scale-110 transition-transform duration-200 rounded-full"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-sm sm:text-base opacity-80">
        © {new Date().getFullYear()} {data.footer.copyright}{" "}
        <a
          href={data.footer.poweredBy[1]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {data.footer.poweredBy[0]}
        </a>
      </div>
    </footer>
  );
}
