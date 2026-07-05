// Ambionneri kararavarcman ej — ListPage component-ov
// title.am-y ogtagurvum e label hamar
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ListPage from '@/components/ListPage';
export default function ChairsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => api.get('/chairs').then(r => setItems(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const del = async (id: string) => { if (!confirm('Ջնջե՞լ')) return; await api.delete(`/chairs/${id}`); load(); };
  return <ListPage title="Ամբիոններ" subtitle={`${items.length} ամբիոն`}
    items={items.map(i => ({ _id: i._id, label: i.title?.am || '', sub: i.boss?.name || '' }))}
    newHref="/dashboard/chairs/new" editHrefPrefix="/dashboard/chairs" onDelete={del} loading={loading} emptyMsg="Ամբիոններ չկան" />;
}
