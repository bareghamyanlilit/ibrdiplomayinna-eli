"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LangContext";
import { P } from "./descr";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
console.log('====================================');
console.log(API);
console.log('====================================');

interface LocalizedText { am: string; ru: string; en: string; }
interface LibFile {
  _id: string;
  name: LocalizedText | string;
  specialty: LocalizedText | string;
  fileName: string;
  filePath: string;
  fileSize: number;
}

function fmtSize(b: number) {
  if (!b) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export function Library() {
  const { data, currentLang } = useLanguage();
  const lang = (currentLang as 'am' | 'ru' | 'en') || 'am';

  const [items, setItems] = useState<LibFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSpec, setFilterSpec] = useState("");

  useEffect(() => {
    fetch(`${API}/library`)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const getDisplayName = (f: LibFile) => {
    if (typeof f.name === "string") return f.name;
    return f.name[lang] || f.name.am || f.fileName;
  };

  const getSpecLabel = (s: LocalizedText | string) => {
    if (typeof s === "string") return s;
    return s[lang] || s.am || "";
  };

  const getSpecKey = (s: LocalizedText | string) =>
    typeof s === "string" ? s : (s.am || "");

  const specialties = [...new Map(items.map(i => [getSpecKey(i.specialty), i.specialty])).values()];

  const filtered = items.filter(i => {
    const displayName =
      typeof i.name === "string"
        ? i.name
        : (i.name.am + " " + (i.name.ru || "") + " " + (i.name.en || ""));

    const specLabel = getSpecLabel(i.specialty);

    const ms =
      !search ||
      displayName.toLowerCase().includes(search.toLowerCase()) ||
      specLabel.toLowerCase().includes(search.toLowerCase());

    const msp = !filterSpec || getSpecKey(i.specialty) === filterSpec;

    return ms && msp;
  });

  const grouped = filtered.reduce((acc, item) => {
    const k = getSpecKey(item.specialty);
    if (!acc[k]) acc[k] = { label: item.specialty, files: [] };
    acc[k].files.push(item);
    return acc;
  }, {} as Record<string, { label: LocalizedText | string; files: LibFile[] }>);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-400">
        {data.library.loading}
      </div>
    );

  if (items.length === 0)
    return (
      <P txt={data.library.havent} className="text-center text-gray-500 mt-10" />
    );

  return (
    <div className="w-[92%] sm:w-[85%] mx-auto py-10">
      
      {/* Header / Controls */}
      <div className="mb-10 bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={data.library.search}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004471] transition"
          />

          <select
            value={filterSpec}
            onChange={e => setFilterSpec(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#004471]"
          >
            <option value="">{data.library.all}</option>
            {specialties.map((s, i) => {
              const k = getSpecKey(s);
              return (
                <option key={i} value={k}>
                  {getSpecLabel(s)}
                </option>
              );
            })}
          </select>

        </div>
      </div>

      {/* Groups */}
      <div className="space-y-10">
        {Object.entries(grouped).map(([specKey, { label, files }]) => (
          <div key={specKey}>
            
            <h2 className="text-xl font-bold text-[#004471] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#004471]" />
              {getSpecLabel(label)}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map(f => (
                <a
                  key={f._id}
                  href={`${SERVER}${f.filePath}`}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="group relative p-4 rounded-2xl border border-gray-200 bg-white shadow-sm "
                >
                  
                  <div className="flex items-center gap-3">
                    
                    <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#004471] to-[#002b3d] flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate ">
                        {getDisplayName(f)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {fmtSize(f.fileSize)}
                      </p>
                    </div>

                    <div className="opacity-100 ">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#004471" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </div>

                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">
          {data.library.havent}
        </p>
      )}
    </div>
  );
}