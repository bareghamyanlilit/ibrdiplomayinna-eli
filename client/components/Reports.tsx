
"use client";

import { useLanguage } from "@/context/LangContext";
import Link from "next/link";
import { H2 } from "./title";
import { P } from "./descr";
import { FaFileAlt } from "react-icons/fa";

interface ReportFile {
    file: string;
    name: string;
}

interface ReportYear {
    year: string;
    files: ReportFile[];
}

export function Reports() {
    const { data } = useLanguage();

    // Ժամանակավոր տիպային սահմանում՝ մինչև LangContext-ի ուղղումը
    const pdfs = (
        data as typeof data & {
            pdfs?: ReportYear[];
        }
    ).pdfs ?? [];

    return (
        <div className="container m-auto pt-5">
            {pdfs.map((yearGroup:any, yearIndex:any) => (
                <section key={`${yearGroup.year}-${yearIndex}`}>
                    <H2
                        txt={yearGroup.year}
                        className="my-5 text-center text-[#004471] md:my-10"
                    />

                    {yearGroup.files.map((el:any, i:any) => (
                        <div key={el.file}>
                            <Link
                                href={`/pdfs/${el.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-5 px-5 py-5 md:py-10"
                            >
                                <div className="text-5xl text-[#004471] md:text-2xl">
                                    <FaFileAlt />
                                </div>

                                <P txt={el.name} />
                            </Link>

                            {i !== yearGroup.files.length - 1 && (
                                <hr className="m-auto w-[90%] text-[#004471]" />
                            )}
                        </div>
                    ))}
                </section>
            ))}
        </div>
    );
}
