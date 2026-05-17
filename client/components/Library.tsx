// Gradran ej — fetch API-ic, filtravorenq masnagitvutyunov ev paxtumov
// fmtSize helper-y bytes-y human-readable format e vercnum
// Failery khmbavorvum en masnagitvutyunnerov
// Fail-i vra click-y anumayin download e brauzeri majakum
"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LangContext";
import { P } from "./descr";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

interface LibFile { _id: string; name: string; specialty: string; fileName: string; filePath: string; fileSize: number; }

function fmtSize(b: number) {
  if (!b) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export function Library() {
  const { data } = useLanguage();
  const [items, setItems] = useState<LibFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSpec, setFilterSpec] = useState("");

  useEffect(() => {
    fetch(`${API}/library`).then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  const specialties = [...new Set(items.map(i => i.specialty))].sort();
  const filtered = items.filter(i => {
    const ms = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.specialty.toLowerCase().includes(search.toLowerCase());
    const msp = !filterSpec || i.specialty === filterSpec;
    return ms && msp;
  });

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.specialty]) acc[item.specialty] = [];
    acc[item.specialty].push(item);
    return acc;
  }, {} as Record<string, LibFile[]>);

  if (loading) return <div className="text-center py-20 text-gray-400">{data.library.loading}</div>;

  if (items.length === 0) return <P txt={data.library.havent} className="my-4 mx-2 text-center text-gray-500" />;

  return (
    <div className="container w-[90%] sm:w-[80%] mx-auto py-8">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder={data.library.search}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
        <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471] bg-white">
          <option value="">{data.library.all}</option>
          {specialties.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Files grouped by specialty */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([spec, files]) => (
          <div key={spec}>
            <h2 className="text-lg font-bold text-[#004471] mb-3 border-b border-[#004471] pb-1">{spec}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {files.map(f => (
                <a key={f._id}
                  href={`${SERVER}${f.filePath}`}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-[#004471] hover:bg-blue-50 transition-all group">
                  {/* File icon */}
                  <div className="w-10 h-10 bg-[#004471] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#003865] transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{f.name}</p>
                    <p className="text-xs text-gray-400">{fmtSize(f.fileSize)}</p>
                  </div>
                  {/* Download arrow */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#004471" strokeWidth="2" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-gray-400 py-12">{data.library.havent}</p>}
    </div>
  );
}
