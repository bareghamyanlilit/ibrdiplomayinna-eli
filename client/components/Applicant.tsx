// Dimordneri aghyusak — API-ic kkam static fallback
// full (acarakan) ev remote (havakan) tolery razmastel (tabolnernerov)
// headers-y lezvakac lezunerom ararunum en
"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LangContext";
import { H2 } from "./title";
import { P } from "./descr";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Lang = "am" | "ru" | "en";
type LText = { am: string; ru: string; en: string };

interface Row {
  _id: string;
  specialty: LText; educationBase: LText; qualification: LText; subjects: LText; duration: LText;
  type: "full" | "remote";
}

export function Applicant() {
  const { data, currentLang } = useLanguage();
  const lang = (currentLang as Lang) || "am";
  const [rows, setRows] = useState<Row[]>([]);
  const [useApi, setUseApi] = useState(false);

  useEffect(() => {
    fetch(`${API}/admissions`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) { setRows(d); setUseApi(true); } })
      .catch(() => {});
  }, []);

  const t = (f: LText) => f?.[lang] || f?.am || "";

  if (!useApi) {
    // Static fallback
    return (
      <div className="container w-[90%] sm:w-[80%] mx-auto">
        <div>
          <H2 txt={data.aboutInfo.admissionsData.title} />
          <P txt={data.aboutInfo.admissionsData.descr} className="mb-4" />
          <div className="overflow-x-auto">
            <table className="w-full border-0 text-left text-sm sm:text-base">
              <thead>
                <tr className="bg-[#003865] text-white text-sm sm:text-xl">
                  {data.aboutInfo.admissionsData.table[0].map((elem:any, i:any) => <th key={i} className="px-3 py-2 sm:px-6 sm:py-5 font-bold">{elem}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.aboutInfo.admissionsData.table.slice(1).map((e:any, i:any) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {e.map((elem:any, j:any) => <td key={j} className="px-3 py-2 sm:px-6 sm:py-5">{elem}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-10">
          <H2 txt={data.aboutInfo.remotelyAdmissionsData.title} />
          <P txt={data.aboutInfo.remotelyAdmissionsData.descr} className="mb-4" />
          <div className="overflow-x-auto">
            <table className="w-full border-0 text-left text-sm sm:text-base">
              <thead>
                <tr className="bg-[#003865] text-white text-sm sm:text-xl">
                  {data.aboutInfo.remotelyAdmissionsData.table[0].map((elem:any, i:any) => <th key={i} className="px-3 py-2 sm:px-6 sm:py-5 font-bold">{elem}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.aboutInfo.remotelyAdmissionsData.table.slice(1).map((e:any, i:any) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {e.map((elem:any, j:any) => <td key={j} className="px-3 py-2 sm:px-6 sm:py-5">{elem}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const headers = lang === "ru"
    ? ["Специальность", "Основа образования", "Квалификация", "Финансируемые предметы", "Срок"]
    : lang === "en"
    ? ["Specialty", "Education Base", "Qualification", "Subjects", "Duration"]
    : ["Մasnagitvutyun", "Krtakan himk", "Vorkavarum", "Ararkanner", "Zhamket"];

  const full = rows.filter(r => r.type === "full");
  const remote = rows.filter(r => r.type === "remote");

  const Table = ({ data: tData }: { data: Row[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-0 text-left text-sm sm:text-base">
        <thead>
          <tr className="bg-[#003865] text-white text-sm sm:text-xl">
            {headers.map((h, i) => <th key={i} className="px-3 py-2 sm:px-6 sm:py-5 font-bold">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tData.map((row, i) => (
            <tr key={row._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-3 py-2 sm:px-6 sm:py-5">{t(row.specialty)}</td>
              <td className="px-3 py-2 sm:px-6 sm:py-5">{t(row.educationBase)}</td>
              <td className="px-3 py-2 sm:px-6 sm:py-5">{t(row.qualification)}</td>
              <td className="px-3 py-2 sm:px-6 sm:py-5">{t(row.subjects)}</td>
              <td className="px-3 py-2 sm:px-6 sm:py-5">{t(row.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container w-[90%] sm:w-[80%] mx-auto">
      <div>
        <H2 txt={data.aboutInfo.admissionsData.title} />
        <P txt={data.aboutInfo.admissionsData.descr} className="mb-4" />
        <Table data={full} />
      </div>
      <div className="mt-10">
        <H2 txt={data.aboutInfo.remotelyAdmissionsData.title} />
        <P txt={data.aboutInfo.remotelyAdmissionsData.descr} className="mb-4" />
        <Table data={remote} />
      </div>
    </div>
  );
}
