// Ambionneri haycak — API-ic (kkam static fallback)
// imgSrc helper-y /uploads path-y SERVER-ov lracnenq
"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LangContext";
import Image from "next/image";
import Link from "next/link";
import { H2 } from "./title";
import Loading from "./Loading";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

interface ChairItem { _id: string; title: { am: string; ru: string; en: string }; img: string; }

export function Chairs() {
  const { data, currentLang } = useLanguage();
  const lang = (currentLang as "am" | "ru" | "en") || "am";
  const [items, setItems] = useState<ChairItem[]>([]);
  const [useApi, setUseApi] = useState(false);

  useEffect(() => {
    fetch(`${API}/chairs`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) { setItems(d); setUseApi(true); } })
      .catch(() => { });
  }, []);

  const imgSrc = (src: string) => src?.startsWith("/uploads") ? `${SERVER}${src}` : src;

  if (!useApi) {
    return (

      <Loading />
    );
  }

  return (
    <div>
      <H2 txt={data.staff.chairs.title} className="text-center font-bold my-5 sm:my-8" />
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 justify-self-center">
        {items.map(chair => (
          <div key={chair._id} className="flex flex-col w-62.5 sm:w-100 border-0 shadow-xl rounded-2xl p-10 text-center justify-between items-center gap-2">
            {chair.img && <img src={imgSrc(chair.img)} alt={chair.title[lang] || chair.title.am} width={90} height={90} className="object-contain w-22.5 h-22.5" />}
            <h3 className="text-sm sm:text-2xl font-semibold">{chair.title[lang] || chair.title.am}</h3>
            <Link href={`/chairs/${chair._id}`} className="text-base sm:text-xl text-[#004471] border border-[#004471] rounded px-3 py-1">
              {lang === "am" ? "Avelyln" : lang === "ru" ? "Podrobnee" : "More"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
