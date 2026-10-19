"use client";

import { useEffect, useState } from "react";
import { H2 } from "./title";
import { P } from "./descr";
import { useLanguage } from "@/context/LangContext";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

interface Member {
  _id: string;
  name: string;
  descr: string;
  src: string;
  position: string;
  order: number;
}

export function StudentCouncil() {
  const { data } = useLanguage();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/studentCouncil`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setMembers(d);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const imgSrc = (src: string) =>
    src?.startsWith("/uploads") ? `${SERVER}${src}` : src;

  const president = members.find(
    (m) => m.position === "Ուսանողական խորհրդի նախագահ"
  );

  const vicePresident = members.find(
    (m) => m.position === "Ուսանողական խորհրդի փոխնախագահ"
  );

  const secretary = members.find(
    (m) => m.position === "Ուսանողական խորհրդի քարտուղար"
  );

  if (loading) {
    return (
      <div className="container">
        <p>Բեռնվում է...</p>
      </div>
    );
  }

  return (
    <div className="container w-[90%] sm:w-[80%] mx-auto">
      <H2 txt={data.studentCouncil.title} />
      <P txt={data.studentCouncil.descr} className="text-justify mb-10" />

      <div className="flex flex-wrap justify-center gap-8">
        {[president, vicePresident, secretary]
          .filter(Boolean)
          .map((member) => (
            <div
              key={member!._id}
              className="w-[280px] flex flex-col gap-2"
            >
              {member!.src && (
                <img
                  src={imgSrc(member!.src)}
                  alt={member!.name}
                  className="object-cover h-[320px] w-full"
                />
              )}

              <h3 className="font-bold text-xl">
                {member!.name}
              </h3>

              <p className="text-[#003865] font-semibold">
                {member!.position}
              </p>

              {member!.descr && (
                <p>
                  {member!.descr}
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}