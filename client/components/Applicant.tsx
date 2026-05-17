"use client";

import { useLanguage } from "@/context/LangContext";
import {H2} from "./title";
import {P} from "./descr";

export  function Applicant() {
  const { data } = useLanguage();
  return (
    <div className=" container w-[90%] sm:w-[80%] mx-auto">
      {/* Ընդունելության մաս */}
      <div>
        <H2 txt={data.aboutInfo.admissionsData.title} />
        <P txt={data.aboutInfo.admissionsData.descr} className="mb-4 " />

        <div className="overflow-x-auto ">
          <table className="w-full border-0 text-left text-sm sm:text-base">
            <thead>
              <tr className="bg-[#003865] text-white  text-sm sm:text-xl">
                {data.aboutInfo.admissionsData.table[0].map((elem, i) => (
                  <th key={i} className=" px-3 py-2 sm:px-6 sm:py-5 font-bold">
                    {elem}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.aboutInfo.admissionsData.table.slice(1).map((e, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {e.map((elem, i) => (
                    <td key={i} className=" px-3 py-2 sm:px-6 sm:py-5 ">
                      {elem}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Հեռակա ընդունելություն */}
      <div>
        <H2 txt={data.aboutInfo.remotelyAdmissionsData.title} />
        <P
          txt={data.aboutInfo.remotelyAdmissionsData.descr}
          className="mb-4 "
        />

        <div className="overflow-x-auto ">
          <table className="w-full border-0 text-left text-sm sm:text-base">
            <thead>
              <tr className="bg-[#003865] text-white  text-sm sm:text-xl">
                {data.aboutInfo.remotelyAdmissionsData.table[0].map(
                  (elem, i) => (
                    <th
                      key={i}
                      className=" px-3 py-2 sm:px-6 sm:py-5 font-bold"
                    >
                      {elem}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.aboutInfo.remotelyAdmissionsData.table
                .slice(1)
                .map((e, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {e.map((elem, i) => (
                      <td key={i} className=" px-3 py-2 sm:px-6 sm:py-5 ">
                        {elem}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}