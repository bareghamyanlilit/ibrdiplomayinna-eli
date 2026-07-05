// Mek masnagitvutyuni masnakrum — API MongoDB ID-ov kkam numeric index
// Erjankutyun nkarerov ev videoov (ogtagurvum e HTML5 <video>)
// infoParts-y textagir maser en masnagitvutyunov
// Fallback-y static data-ic (numeric index-ov)
"use client";
import { P } from "@/components/descr";
import Image from "next/image";
import { useLanguage } from "@/context/LangContext";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

interface DeptData {
  _id: string;
  color: string;
  title: { am: string; ru: string; en: string };
  descr: { am: string; ru: string; en: string };
  video: string;
  infoParts: { title: { am: string; ru: string; en: string }; info: { img: string; title: { am: string; ru: string; en: string }; desc: { am: string; ru: string; en: string } }[] };
  images: string[];
  partImgTitle: { am: string; ru: string; en: string };
}

function imgSrc(src: string) {
  return src?.startsWith("/uploads") ? `${SERVER}${src}` : src;
}

export function Department({ id }: { id: string | number }) {
  const { data, currentLang } = useLanguage();
  const lang = (currentLang as "am" | "ru" | "en") || "am";
  const [dept, setDept] = useState<DeptData | null>(null);
  const [useApi, setUseApi] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Try fetching by MongoDB ID first (string), fallback to index
    const isMongoId = typeof id === "string" && id.length === 24;
    if (isMongoId) {
      fetch(`${API}/departments/${id}`)
        .then(r => r.json())
        .then(d => { if (d._id) { setDept(d); setUseApi(true); } })
        .catch(() => {});
    } else {
      // It's a numeric index – fetch all and pick by index
      fetch(`${API}/departments`)
        .then(r => r.json())
        .then(arr => { if (Array.isArray(arr) && arr[Number(id)]) { setDept(arr[Number(id)]); setUseApi(true); } })
        .catch(() => {});
    }
  }, [id]);

  // Fallback: use static data by index
  if (!useApi) {
    return (
      <div className="masn">Load </div>
    );
  }

  // API data
  const t = (f: { am: string; ru: string; en: string }) => f?.[lang] || f?.am || "";

  return (
    <div className="masn">
      <div style={{ backgroundColor: dept!.color }} className="hero text-white text-center border-t-2 border-white p-6 sm:p-12">
        <h1 className="text-base sm:text-2xl font-bold">{t(dept!.title)}</h1>
        <P txt={t(dept!.descr)} className="mt-4 text-white" />
      </div>
      <div className="about mb-24 container w-full sm:w-[80%] mx-auto">
        <div className="container mx-auto px-4">
          <div className="info grid gap-12">
            {dept!.video && (
              <div className="relative w-full max-h-150 mt-12">
                {!videoLoaded && <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-lg z-10">Loading video...</div>}
                <video className="w-full max-h-150 object-cover" controls autoPlay muted loop onLoadedData={() => setVideoLoaded(true)}>
                  <source src={imgSrc(dept!.video)} type="video/mp4" />
                </video>
              </div>
            )}
            {dept!.infoParts?.info?.length > 0 && (
              <div className="boxs">
                <h3 className="title text-center text-base sm:text-3xl font-semibold mb-6">{t(dept!.infoParts.title)}</h3>
                <div className="flex flex-wrap gap-20">
                  {dept!.infoParts.info.map((item, i) => (
                    <div key={i} className="w-full">
                      <div className="relative flex-col flex sm:flex-row items-center mb-12">
                        {item.img && (
                          <div className="relative w-full sm:w-150 h-62.5 sm:h-125">
                            <img src={imgSrc(item.img)} alt="img" className="object-cover w-full h-full" />
                          </div>
                        )}
                        <span style={{ backgroundColor: dept!.color }} className="hidden sm:block absolute left-[60%] top-[0%] w-[35%] h-0.5 -translate-y-1/2 rotate-90 origin-left"></span>
                        <div className="relative sm:absolute sm:right-0 bg-white p-6 sm:p-8 shadow-lg sm:border-r-[6px] sm:border-b-[6px] w-full sm:w-175 mt-4 sm:mt-0" style={{ borderBlockColor: dept!.color }}>
                          <h3 className="text-base sm:text-2xl font-bold mb-3">{t(item.title)}</h3>
                          <P txt={t(item.desc)} />
                        </div>
                      </div>
                      <hr style={{ backgroundColor: dept!.color }} className="h-0.75 sm:h-1.5 w-full border-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {dept!.images?.length > 0 && (
        <div className="events">
          <h2 className="title text-center text-2xl font-bold mb-10">{t(dept!.partImgTitle)}</h2>
          <div className="container mx-auto px-4">
            <div className="images flex flex-wrap justify-center gap-5">
              {dept!.images.map((item, i) => (
                <div key={i} className="relative w-125 h-87.5">
                  <img src={imgSrc(item)} alt="" className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
