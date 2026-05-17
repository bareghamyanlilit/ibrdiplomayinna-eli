'use client';

import {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode
} from 'react';

// Statik textagir tvyalnery (am/ru/en)
import {data as dataAM} from '../data/dataAM';
import {data as dataRU} from '../data/dataRU';
import {data as dataEN} from '../data/dataEN';

// DataType-y vercnum enq dataAM-i kazmvacqic (bolor lezunery nuynyus kazm unen)
type DataType = typeof dataAM;

// Context-i type-y — aylteq lezun, tvyalnery ev lezuny poxelu function
type LangContextType = {
    currentLang: string;
    data: DataType;
    setCurrentLang: (c: string)=> void;
};

// Context-y stexcum enq lranaguyts bolor armeneren tvyalnerov
const LangContext = createContext<LangContextType>({
    currentLang: '',
    data: dataAM,
    setCurrentLang: ()=> {},
});

// Provider — amsbyervum e applicaciayi vra, pahum e aylteq lezun ev tvyalnery
export function LangProvider({ children }: { children: ReactNode }) {

    const [currentLang, setCurrentLang] = useState('am');
    const [data, setData] = useState(dataAM);

    // currentLang poxvac zhamanak arsknacnum enq tvyalnery
    useEffect(()=>{

        if(currentLang === 'am') setData(dataAM);
        if(currentLang === 'ru') setData(dataRU);
        if(currentLang === 'en') setData(dataEN);

    }, [currentLang]);
    

    return (
        <LangContext.Provider value={{ currentLang, setCurrentLang, data }}>
            {children}
        </LangContext.Provider>
    )
}

// Custom hook — artaqin componentnery kararum en context-in
export const useLanguage = () => useContext(LangContext);

// Naхkin alternative mshakum (comment-arkel)
// // context/LanguageContext.tsx
// "use client";
// import { createContext, useState, useContext, useEffect, ReactNode } from "react";
// import { dataAM } from "../data/dataAM";
// import { dataRU } from "../data/dataRU";
// import { dataEN } from "../data/dataEN";

// type DataType = typeof dataAM;

// export default function ClientLanguageLoader({
//   children,
// }: {
//   children: (data: DataType) => ReactNode;
// }) {
//   const [data, setData] = useState<DataType>(dataAM);

//   useEffect(() => {
//     const lang = localStorage.getItem("lang") || "am";
//     switch (lang) {
//       case "ru":
//         setData(dataRU);
//         break;
//       case "en":
//         setData(dataEN);
//         break;
//       default:
//         setData(dataAM);
//     }
//   }, []);

//   return <>{children(data)}</>;
// }
