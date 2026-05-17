// Htvetvordneri ej — PDF faileri hayecakum `data.pdfs` tvyalneric
// Kaz tarineri PDF-nery separate bazhmagornerov
// FaFileAlt icon-y ogtagurvum e react-icons-ic
"use client";
import { useLanguage } from "@/context/LangContext";
import Link from "next/link";
import { H2 } from "./title";
import { P } from "./descr";
import {  FaFileAlt } from "react-icons/fa";
export function Reports() {
  const { data } = useLanguage();
  return (
    <div className="container m-auto pt-5">
      <H2 txt={data.pdfs[0].year} className="text-[#004471] my-2 md:my-5 text-center"></H2>
      {data.pdfs[0].files.map((el, i) => {
        return (
          <div key={el.file}>
            <Link
              href={`/pdfs/${el.file}`}
              target="_blank"
              className="py-5 md:py-10 px-5 flex items-center gap-5"
            >
              <div className="text-5xl md:text-2xl text-[#004471] ">
              <FaFileAlt />
              </div>
                
              <P txt={el.name}></P>
            </Link>
            {i !== data.pdfs[0].files.length-1  && <hr className="text-[#004471] m-auto w-[90%]"/>}
          </div>
        );
      })}
      <H2 txt={data.pdfs[1].year} className="text-[#004471] my-5 md:my-10 text-center"></H2>
      {data.pdfs[1].files.map((el, i) => {
        return (
          <div key={el.file} className="">
            <Link
              href={`/pdfs/${el.file}`}
              target="_blank"
              className="py-5 md:py-10 px-5 flex items-center gap-5"
            >
              <div className="text-[#004471] text-5xl md:text-2xl">
              <FaFileAlt />
              </div>
              <P txt={el.name}></P>
            </Link>
            {i !== data.pdfs[1].files.length-1  && <hr className=" text-[#004471] m-auto w-[90%]" />}
          </div>
        );
      })}
    </div>
  );
}
