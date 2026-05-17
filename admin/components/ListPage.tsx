// Reusable list component admin panel-i bolor section-neri hamar
// "Avelyacnel" knop, edit (pencil) ev delete (trash) knopner
// loading kkam dpaka patasxannerov
'use client';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ListItem {
  _id: string;
  label: string;
  sub?: string;
}

interface ListPageProps {
  title: string;
  subtitle: string;
  items: ListItem[];
  newHref: string;
  editHrefPrefix: string;
  onDelete: (id: string) => void;
  loading: boolean;
  emptyMsg?: string;
}

export default function ListPage({ title, subtitle, items, newHref, editHrefPrefix, onDelete, loading, emptyMsg }: ListPageProps) {
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        <button onClick={() => router.push(newHref)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#004471] text-white rounded-xl text-sm font-semibold hover:bg-[#003560] transition-colors">
          <Plus size={16} />
          Ավելացնել
        </button>
      </div>
      {loading ? <p className="text-gray-500">Բեռնվում է...</p>
        : items.length === 0 ? <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">{emptyMsg || 'Տվյալներ չկան'}</div>
        : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.label}</p>
                  {item.sub && <p className="text-xs text-gray-400 truncate">{item.sub}</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => router.push(`${editHrefPrefix}/${item._id}`)}
                    className="p-2 text-gray-400 hover:text-[#004471] hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => onDelete(item._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
