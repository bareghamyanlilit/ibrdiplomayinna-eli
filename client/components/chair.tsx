// Mek ambioni masnakrum — API-ic MongoDB ID-ov kkam numeric index-ov
// isMongoId check-y nayum e id-y 24 nishaner unenum e
// Fallback-y static data-ic e (numeric index-ov)
// t() helper-y vaverakan lezvayin tarbelak (am/ru/en) e veradardzenq
"use client";
import { P } from "@/components/descr";
import { useLanguage } from "@/context/LangContext";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

interface ChairData {
  _id: string;
  title: { am: string; ru: string; en: string };
  descr: { am: string; ru: string; en: string };
  boss: { name: string; descr: string; src: string };
  staff: string[];
}

export function Chair({ id }: { id: string | number }) {
  const { data, currentLang } = useLanguage();
  const lang = (currentLang as "am" | "ru" | "en") || "am";
  const [chairData, setChairData] = useState<ChairData | null>(null);
  const [useApi, setUseApi] = useState(false);

  useEffect(() => {
    const isMongoId = typeof id === "string" && id.length === 24;
    if (isMongoId) {
      fetch(`${API}/chairs/${id}`).then(r => r.json()).then(d => { if (d._id) { setChairData(d); setUseApi(true); } }).catch(() => {});
    } else {
      fetch(`${API}/chairs`).then(r => r.json()).then(arr => { if (Array.isArray(arr) && arr[Number(id)]) { setChairData(arr[Number(id)]); setUseApi(true); } }).catch(() => {});
    }
  }, [id]);

  const imgSrc = (src: string) => src?.startsWith("/uploads") ? `${SERVER}${src}` : src;

  if (!useApi) {
    return (
      <div className="container w-[90%] sm:w-[80%] mx-auto">load</div>
    );
  }

  const t = (f: { am: string; ru: string; en: string }) => f?.[lang] || f?.am || "";

  return (
    <div className="container w-[90%] sm:w-[80%] mx-auto">
      <div className="flex flex-col gap-3 sm:gap-20 justify-around my-5">
        <div className="grid gap-5">
          <div className="justify-items-center">
            <h3 className="text-center font-bold text-base sm:text-2xl mb-4">{t(chairData!.title)}</h3>
            <P txt={t(chairData!.descr)} className="max-w-250 text-justify whitespace-pre-line" />
          </div>
          <div className="sm:flex justify-center my-10">
            {chairData!.boss?.name && (
              <div className="flex flex-col items-center gap-0 sm:gap-2">
                {chairData!.boss.src && (
                  <img src={imgSrc(chairData!.boss.src)} alt={chairData!.boss.name} className="object-cover h-75 w-75" />
                )}
                <h1 className="font-bold text-base">{chairData!.boss.name}</h1>
                <p>{chairData!.boss.descr}</p>
              </div>
            )}
            <div className="my-5 sm:mx-30">
              <p className="my-2 text-base sm:text-2xl text-black">{data.staff.chairs.subTitle}</p>
              {chairData!.staff.map((elem, i) => <P txt={elem} key={i} className="my-1" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
