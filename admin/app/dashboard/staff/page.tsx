// Anjnakazci kararavarcman ej — inline form sidebar ev list
// category select: boss / educationalAid / serviceStaff
// Photo upload multer-i majakum (FormData-ov)
'use client';
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

const CAT_LABELS: Record<string, string> = {
  boss: 'Ղեկավար անձնակազմ',
  educationalAid: 'Ուսումնաօժանդակ անձնակազմ',
  serviceStaff: 'Սպասարկող անձնակազմ',
};

interface StaffMember {
  _id: string; name: string; descr: string; src: string; category: string; order: number;
}

const empty = (): Omit<StaffMember, '_id'> => ({ name: '', descr: '', src: '', category: 'boss', order: 0 });

export default function StaffAdminPage() {
  const [items, setItems] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<StaffMember> | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api.get('/staff').then(r => setItems(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditItem(empty()); setPhotoFile(null); setError(''); };
  const openEdit = (item: StaffMember) => { setEditItem({ ...item }); setPhotoFile(null); setError(''); };
  const closeModal = () => { setEditItem(null); setPhotoFile(null); };

  const save = async () => {
    if (!editItem?.name) { setError('Անունը պարտադիր է'); return; }
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      fd.append('name', editItem.name || '');
      fd.append('descr', editItem.descr || '');
      fd.append('src', editItem.src || '');
      fd.append('category', editItem.category || 'boss');
      fd.append('order', String(editItem.order || 0));
      if (photoFile) fd.append('photo', photoFile);
      if (editItem._id) await api.put(`/staff/${editItem._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/staff', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      closeModal(); load();
    } catch (err: any) { setError(err?.response?.data?.message || 'Սխալ'); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Ջնջե՞լ')) return;
    await api.delete(`/staff/${id}`); load();
  };

  const grouped = Object.keys(CAT_LABELS).reduce((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat);
    return acc;
  }, {} as Record<string, StaffMember[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Անձնակազմ</h1>
          <p className="text-gray-500 text-sm">{items.length} անդամ</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-[#004471] text-white rounded-xl text-sm font-semibold hover:bg-[#003560] transition-colors">
          <Plus size={16} /> Ավելացնել
        </button>
      </div>

      {loading ? <p className="text-gray-500">Բեռնվում է...</p> : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, members]) => (
            <div key={cat} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-[#004471] text-white text-sm font-bold">{CAT_LABELS[cat]} ({members.length})</div>
              {members.length === 0 ? (
                <p className="text-gray-400 text-sm px-5 py-4">Անդամներ չկան</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {members.map(m => (
                    <div key={m._id} className="flex items-center gap-3 px-5 py-3">
                      {m.src ? <img src={m.src.startsWith('/') ? `${SERVER}${m.src}` : m.src} className="w-10 h-10 rounded-full object-cover flex-shrink-0 border" alt="" /> : <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400 text-lg font-bold">{m.name[0]}</div>}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.descr}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(m)} className="p-1.5 text-gray-400 hover:text-[#004471] hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => del(m._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900">{editItem._id ? 'Խմբագրել' : 'Ավելացնել'} անձնակազմի անդամ</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Կատեգորիա</label>
                <select value={editItem.category} onChange={e => setEditItem(p => ({ ...p!, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]">
                  {Object.entries(CAT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Անուն Ազգանուն *</label>
                <input value={editItem.name || ''} onChange={e => setEditItem(p => ({ ...p!, name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Պաշտոն</label>
                <input value={editItem.descr || ''} onChange={e => setEditItem(p => ({ ...p!, descr: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Լուսանկար</label>
                {(editItem.src || photoFile) && <img src={photoFile ? URL.createObjectURL(photoFile) : (editItem.src!.startsWith('/') ? `${SERVER}${editItem.src}` : editItem.src!)} className="w-16 h-16 object-cover rounded-full mb-2 border" alt="" />}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) setPhotoFile(e.target.files[0]); }} />
                <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-[#004471] border border-[#004471] rounded px-3 py-1.5 hover:bg-blue-50 transition-colors">Ընտրել լուսանկար</button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Դասակարգ (#)</label>
                <input type="number" value={editItem.order || 0} onChange={e => setEditItem(p => ({ ...p!, order: Number(e.target.value) }))} className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
              </div>
              {error && <p className="text-red-600 text-xs bg-red-50 rounded px-3 py-2">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-[#004471] text-white rounded-lg font-semibold text-sm hover:bg-[#003560] disabled:opacity-60 transition-colors">
                  {saving ? 'Պահպանվում...' : 'Պահպանել'}
                </button>
                <button onClick={closeModal} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors">Չեղ.</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
