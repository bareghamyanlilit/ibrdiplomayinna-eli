// Norutyunneri ej (News) — fetch anenq API-ic, render anenq lezvakov
// isLatest-y ashxum e arajin element-i vra (granayin dasy)
// formatDate-y lezvakac localization anenq tarikhy
"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LangContext";
import { P } from "./descr";
import { H2 } from "./title";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

interface NewsItem {
  _id: string;
  title: { am: string; ru: string; en: string };
  content: { am: string; ru: string; en: string };
  video?: string;
  images?: string[];
  createdAt: string;
}

export function Notes() {
  const { currentLang, data } = useLanguage();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/news`)
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const lang = (currentLang as "am" | "ru" | "en") || "am";
  const getTitle = (item: NewsItem) => item.title[lang] || item.title.am || "";
  const getContent = (item: NewsItem) => item.content[lang] || item.content.am || "";
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "am" ? "hy-AM" : lang === "ru" ? "ru-RU" : "en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

  if (loading) return <div className="container mx-auto my-8 px-4 text-center text-gray-400 py-12">Բեռնվում է...</div>;

  return (
    <div className="container mx-auto my-8 px-4">
      {items.length > 0 ? (
        <div className="flex flex-col gap-6">
          {items.map((item, index) => {
            const isLatest = index === 0;
            return (
              <div key={item._id} className="flex flex-col gap-4">
                <H2
                  className={`text-xl font-bold m-0 mb-1 ${isLatest ? "text-[#004471]" : "text-gray-800"}`}
                  txt={getTitle(item)}
                />
                <div className={`sm:border-l-4 p-4 rounded-lg shadow-md flex flex-col lg:flex-row gap-4 ${isLatest ? "border-[#004471] bg-blue-50" : "border-gray-300 bg-white"}`}>
                  <div className="flex-1 grid gap-3">
                    <P txt={getContent(item)} className="whitespace-pre-line text-gray-700" />
                    {item.images && item.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                        {item.images.map((img, i) => (
                          <img key={i} src={img.startsWith("/uploads") ? `${SERVER_URL}${img}` : img} alt="" className="w-full h-28 object-cover rounded-md" />
                        ))}
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-2">{formatDate(item.createdAt)}</div>
                  </div>
                  {item.video && (
                    <div className="flex-1 mt-4 lg:mt-0">
                      <iframe className="w-full aspect-video rounded-md" src={item.video} title="Video" frameBorder="0" allowFullScreen />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <P txt={data.events.notes.havent} className="my-4 mx-2 text-center text-gray-500" />
      )}
    </div>
  );
}
