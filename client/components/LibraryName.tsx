
"use client";

import { useLanguage } from "@/context/LangContext";
import Image from "next/image";
import img from "@/public/img/library/book.png";

export function LibraryName({ id }: { id: number }) {
    const { data } = useLanguage();

    // Անվտանգ ստուգում՝ մինչև տվյալների կառուցվածքը ճշտելը
    const departments = (
        data as typeof data & {
            departments?: {
                infoParts?: {
                    info?: {
                        title: string;
                    }[];
                };
            }[];
        }
    ).departments;

    const libraryName = departments?.[id];
    const info = libraryName?.infoParts?.info ?? [];

    if (!libraryName) {
        return (
            <div className="container mx-auto mt-12 text-center text-gray-500">
                Գրադարանի տվյալները հասանելի չեն։
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-12 flex w-full flex-wrap justify-center gap-20 sm:w-[80%]">
            {info.map((item:any, i:any) => (
                <div
                    key={i}
                    className="mb-12 flex w-50 flex-col items-center"
                >
                    <Image
                        src={img}
                        alt="Գրադարանի գիրք"
                        width={600}
                        height={500}
                        className="object-cover"
                    />
                    <h3 className="mb-3 text-base font-bold">
                        {item.title}
                    </h3>
                    <button>Ներբեռնել</button>
                </div>
            ))}
        </div>
    );
}
