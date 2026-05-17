// Admin panel-i koxmic navigation — bolor section-nery (haytararutyunner, norutyunner, anjnakazm etc.)
// active state-y haschvum e pathname-ov
// logout-y jnjum e localStorage-ic tokeny ev return e /login
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Megaphone, Newspaper, LogOut, LayoutDashboard, GraduationCap, Users, BookOpen, Library, ClipboardList, Building2 } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/announcements', label: 'Հայտարարություններ', icon: Megaphone },
  { href: '/dashboard/news', label: 'Գրառումներ', icon: Newspaper },
  { href: '/dashboard/library', label: 'Գրադարան', icon: Library },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('epq_admin_token');
    localStorage.removeItem('epq_admin_user');
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-[#004471] text-white flex flex-col min-h-screen flex-shrink-0">
      <div className="p-6 border-b border-white/20">
        <h1 className="text-lg font-bold">ԷՊՔ</h1>
        <p className="text-blue-200 text-xs mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : (pathname === href || pathname.startsWith(href + '/'));
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${active ? 'bg-white/20 text-white' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/20">
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white w-full text-sm font-medium transition-colors">
          <LogOut size={17} />
          Ելք
        </button>
      </div>
    </aside>
  );
}
