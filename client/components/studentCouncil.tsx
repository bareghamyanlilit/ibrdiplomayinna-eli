// Usanocakan khorhrdari ej — vercnagir ev nkaragrutyun lezvayin tvyalneric
"use client";
import { useLanguage } from "@/context/LangContext";
import { P } from "./descr";
import { H2 } from "./title";

export function StudentCouncil() {
  const { data } = useLanguage();
  return (
    <div className="container">
      <H2 txt={data.studentCouncil.title}></H2>
      <P txt={data.studentCouncil.descr} className="text-justify"></P>
    </div>
  );
}
