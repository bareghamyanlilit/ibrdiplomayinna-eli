// am/ru/en tab-neri component — forms-i hamar lezvayin dzer-i anvazum
// children-y function e vor stvum e aylteq lezuny
'use client';
import { useState } from 'react';

type Lang = 'am' | 'ru' | 'en';

interface LangTabsProps {
  children: (lang: Lang) => React.ReactNode;
}

const LANGS: { code: Lang; label: string }[] = [
  { code: 'am', label: 'Հայ' },
  { code: 'ru', label: 'Рус' },
  { code: 'en', label: 'Eng' },
];

export default function LangTabs({ children }: LangTabsProps) {
  const [active, setActive] = useState<Lang>('am');
  return (
    <div>
      <div className="flex gap-1 mb-4">
        {LANGS.map(({ code, label }) => (
          <button key={code} type="button" onClick={() => setActive(code)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${active === code ? 'bg-[#004471] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  );
}
