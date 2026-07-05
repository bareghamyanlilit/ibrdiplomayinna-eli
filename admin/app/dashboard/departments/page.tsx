// Masnagitvutyunneri kararavarcman ej — ListPage component-ov
// /departments/admin endpoint-y stanum e bolor (naev cherchagrvc) masnagitvutyunnery
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ListPage from '@/components/ListPage';

export default function DepartmentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/departments/admin').then(r => setItems(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm('Ջնջե՞լ մասնագիտությունը')) return;
    await api.delete(`/departments/${id}`);
    load();
  };

  return (
    <ListPage
      title="Մասնագիտություններ"
      subtitle={`${items.length} մասնագիտություն`}
      items={items.map(i => ({ _id: i._id, label: i.title?.am || '', sub: i.isPublished ? 'Հրապարակված' : 'Թաքցված' }))}
      newHref="/dashboard/departments/new"
      editHrefPrefix="/dashboard/departments"
      onDelete={del}
      loading={loading}
      emptyMsg="Մասնագիտություններ չկան"
    />
  );
}
