// Masnagitvutyunneri hayecak — API-ic tverov, fallback-ov static data
// API-i tvyalnery ogtagurvum en ethe array uni ev baci chi
// imgSrc helper-y poxum e /uploads path-y SERVER URL-ov
"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LangContext";
import Image from "next/image";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

interface Dept {
  _id: string;
  title: { am: string; ru: string; en: string };
  descr: { am: string; ru: string; en: string };
  childImg: string;
  linkTxt: { am: string; ru: string; en: string };
  order: number;
}

export function Departments() {
  const { data, currentLang } = useLanguage();
  const lang = (currentLang as "am" | "ru" | "en") || "am";
  const [items, setItems] = useState<Dept[]>([]);
  const [loading, setLoading] = useState(true);
  const [useApi, setUseApi] = useState(false);

  useEffect(() => {
    fetch(`${API}/departments`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) { setItems(d); setUseApi(true); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const imgSrc = (src: string) => src?.startsWith("/uploads") ? `${SERVER}${src}` : src;

  // Fallback to static data
  if (!useApi) {
    return (
      <div className="DepartmentsPage">Load</div>
    );
  }

  return (
    <div className="DepartmentsPage">
      <div className="relative w-full h-[50vh] sm:h-[80vh] mb-6 sm:mb-0">
        <Image src={data.departmentsInfo.img} alt="Քolejy" fill className="object-cover brightness-[0.5]" priority />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-150">
            <h1 className="text-white text-xl md:text-3xl font-bold leading-snug">{data.departmentsInfo.title}</h1>
            <p className="text-white mt-2 text-base md:text-xl">{data.departmentsInfo.descr}</p>
          </div>
        </div>
      </div>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-self-center">
        {items.map((dept, i) => (
          <div key={dept._id} className="flex flex-col w-62.5 sm:w-100 border-0 shadow-xl rounded-2xl p-10 text-center justify-between items-center gap-2">
            {dept.childImg && (
              <img src={imgSrc(dept.childImg)} alt={dept.title[lang] || dept.title.am} width={60} height={60} className="object-contain w-[60px] h-[60px] sm:w-[80px] sm:h-[80px]" />
            )}
            <h3 className="text-sm sm:text-2xl font-semibold">{dept.title[lang] || dept.title.am}</h3>
            <Link href={`/departments/${dept._id}`} className="text-base sm:text-xl text-[#004471] border border-[#004471] rounded px-3 py-1">
              {dept.linkTxt?.[lang] || dept.linkTxt?.am || "Ավmeln"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
