// Anjnakazm ej — boss, educationalAid, serviceStaff kategorianer
// API data kkam static fallback
// imgSrc helper-y poxum e /uploads path-y SERVER-ov
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { H2 } from "./title";
import { useLanguage } from "@/context/LangContext";
import { P } from "./descr";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

interface Member { _id: string; name: string; descr: string; src: string; category: string; order: number; }

export function Staff() {
  const { data } = useLanguage();
  const [apiItems, setApiItems] = useState<Member[]>([]);
  const [useApi, setUseApi] = useState(false);

  useEffect(() => {
    fetch(`${API}/staff`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) { setApiItems(d); setUseApi(true); } })
      .catch(() => {});
  }, []);

  const imgSrc = (src: string) => src?.startsWith("/uploads") ? `${SERVER}${src}` : src;

  if (!useApi) {
    // Fallback static
    return (
      <div className="Staff container w-[90%] sm:w-[80%] mx-auto bg-white">Load</div>
    );
  }

  const boss = apiItems.filter(m => m.category === "boss");
  const eduAid = apiItems.filter(m => m.category === "educationalAid");
  const service = apiItems.filter(m => m.category === "serviceStaff");

  return (
    <div className="Staff container w-[90%] sm:w-[80%] mx-auto bg-white">
      <H2 txt={data.staff.boss.title} className="text-center font-bold my-5 sm:my-8" />
      <div className="flex flex-wrap gap-5 sm:gap-0 justify-around my-5">
        {boss.map(m => (
          <div key={m._id} className="w-[280px] flex flex-col gap-1 sm:gap-2">
            {m.src && <img src={imgSrc(m.src)} alt={m.name} className="object-cover h-[300px] w-full" />}
            <h1 className="font-bold text-xl">{m.name}</h1>
            <p>{m.descr}</p>
          </div>
        ))}
      </div>
      <hr className="border-[#003865] w-[80%] mx-auto border hidden sm:block" />
      <div className="serviceStaff w-full sm:w-max mx-auto px-2 sm:px-10 py-4">
        <H2 txt={data.staff.educationalAid.title} className="text-center font-bold my-5 sm:my-8" />
        <div className="flex flex-col gap-3 justify-around my-5">
          {eduAid.map(m => <div key={m._id}><P txt={`${m.descr} - ${m.name}`} /></div>)}
        </div>
        <H2 txt={data.staff.serviceStaff.title} className="text-center font-bold my-5 sm:my-8" />
        <div className="flex flex-col gap-3 justify-around my-5">
          {service.map(m => <div key={m._id}><P txt={`${m.descr} - ${m.name}`} /></div>)}
        </div>
      </div>
    </div>
  );
}
