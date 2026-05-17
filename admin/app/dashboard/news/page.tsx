// Norutyunneri (graruumneri) kararavarcman ej — list + delete + toggle publish
// Edit-y redirect e /dashboard/news/[id]
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

interface Post { _id: string; title: { am: string }; isPublished: boolean; createdAt: string; }

export default function NewsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { api.get('/news/admin').then((r) => setItems(r.data)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm('Ջնջե՞լ գրառումը')) return;
    await api.delete(`/news/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Գրառումներ</h1>
          <p className="text-gray-500 text-sm">{items.length} գրառում</p>
        </div>
        <button onClick={() => router.push('/dashboard/news/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#004471] text-white rounded-xl text-sm font-semibold hover:bg-[#003560] transition-colors">
          <Plus size={16} />
          Ավելացնել
        </button>
      </div>

      {loading ? <p className="text-gray-500">Բեռնվում է...</p> : items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">Գրառումներ չկան</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.isPublished ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.title.am}</p>
                  <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('hy-AM')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.isPublished ? <Eye size={14} className="text-green-500" /> : <EyeOff size={14} className="text-gray-400" />}
                <button onClick={() => router.push(`/dashboard/news/${item._id}`)}
                  className="p-2 text-gray-400 hover:text-[#004471] hover:bg-blue-50 rounded-lg transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => del(item._id)}
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
