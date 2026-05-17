// Dashboard-i gnayin ej — BOLOR section-neri card-ner counters-ov
// sections array-y define e bolor sections-y hamar endpoint, icon, href, color
// Parallel fetch-ery stanum en count-ery sections.forEach-ov
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Megaphone, Newspaper, Library, Plus } from 'lucide-react';

const sections = [
  { key: 'announcements', label: 'Haytararutyunner', icon: Megaphone, color: 'bg-blue-500', href: '/dashboard/announcements', newHref: '/dashboard/announcements/new', endpoint: '/announcements/admin' },
  { key: 'news', label: 'Graruumner', icon: Newspaper, color: 'bg-emerald-500', href: '/dashboard/news', newHref: '/dashboard/news/new', endpoint: '/news/admin' },
  { key: 'library', label: 'Gradaran', icon: Library, color: 'bg-rose-500', href: '/dashboard/library', newHref: '/dashboard/library', endpoint: '/library/admin' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const u = localStorage.getItem('epq_admin_user');
    if (u) setUser(JSON.parse(u));
    sections.forEach(s => {
      api.get(s.endpoint).then(r => setCounts(p => ({ ...p, [s.key]: r.data.length }))).catch(() => {});
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-8">{user ? `Bari galust, ${user.name}` : 'Betrnvum e...'}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {sections.map(({ key, label, icon: Icon, color, href, newHref }) => (
          <div key={key} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className={`${color} p-2.5 rounded-xl`}><Icon size={20} className="text-white" /></div>
              <span className="text-3xl font-bold text-gray-900">{counts[key] ?? '—'}</span>
            </div>
            <p className="text-xs font-semibold text-gray-500 leading-tight">{label}</p>
            <div className="flex gap-2">
              <button onClick={() => router.push(href)} className="flex-1 text-xs text-[#004471] font-medium hover:underline text-left">Ditel →</button>
              {newHref && (
                <button onClick={() => router.push(newHref)} className="p-1 text-[#004471] hover:bg-blue-50 rounded transition-colors"><Plus size={14} /></button>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-semibold text-gray-800 mb-3">Arag gorceluytnner</h2>
      <div className="flex gap-3 flex-wrap">
        {sections.filter(s => s.newHref).map(s => (
          <button key={s.key} onClick={() => router.push(s.newHref!)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#004471] text-white rounded-xl text-sm font-semibold hover:bg-[#003560] transition-colors">
            <Plus size={15} /> {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
