// Masnagitvutyuni arsknacman ej — id-ov fetch ev DepartmentForm-in talu
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import DepartmentForm from '@/components/DepartmentForm';
export default function EditDepartmentPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState(null);
  useEffect(() => { api.get(`/departments/${id}`).then(r => setItem(r.data)); }, [id]);
  if (!item) return <p className="text-gray-500 p-8">Բեռնվում է...</p>;
  return <div><h1 className="text-2xl font-bold text-gray-900 mb-6">Խմբագրել Մասնագիտությունը</h1><DepartmentForm initial={item} /></div>;
}
