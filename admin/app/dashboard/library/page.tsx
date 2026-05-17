// Gradrani faileri kararavarcman ej
// File upload FormData-ov, masnagitvutyun meta
// Failery khmbavorvum en specialty-ov, edit-y inline e
'use client';
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X, Download, FileText, Search } from 'lucide-react';

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

interface LibFile {
  _id: string; name: string; specialty: string; fileName: string;
  filePath: string; fileSize: number; mimeType: string; isPublished: boolean; order: number;
}

function fmtSize(bytes: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function LibraryAdminPage() {
  const [items, setItems] = useState<LibFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<LibFile> | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api.get('/library/admin').then(r => setItems(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const specialties = [...new Set(items.map(i => i.specialty))].sort();
  const filtered = items.filter(i => {
    const ms = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.fileName?.toLowerCase().includes(search.toLowerCase());
    const msp = !filterSpec || i.specialty === filterSpec;
    return ms && msp;
  });

  const openNew = () => { setEditItem({ name: '', specialty: '', isPublished: true, order: 0 }); setNewFile(null); setError(''); };
  const openEdit = (item: LibFile) => { setEditItem({ ...item }); setNewFile(null); setError(''); };
  const close = () => { setEditItem(null); setNewFile(null); setError(''); };

  const save = async () => {
    if (!editItem?.specialty) { setError('Մասնագիտությունը պարտադիր է'); return; }
    if (!(editItem as any)._id && !newFile) { setError('Ֆայլ ընտրեք'); return; }
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      fd.append('name', editItem.name || newFile?.name || '');
      fd.append('specialty', editItem.specialty!);
      fd.append('order', String(editItem.order || 0));
      fd.append('isPublished', String(editItem.isPublished !== false));
      if (newFile) fd.append('file', newFile);
      if ((editItem as any)._id) await api.put(`/library/${(editItem as any)._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/library', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      close(); load();
    } catch (err: any) { setError(err?.response?.data?.message || 'Սխալ'); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Ջնջե՞լ ֆայլը')) return;
    await api.delete(`/library/${id}`); load();
  };

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.specialty]) acc[item.specialty] = [];
    acc[item.specialty].push(item);
    return acc;
  }, {} as Record<string, LibFile[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Գրադարան</h1>
          <p className="text-gray-500 text-sm">{items.length} ֆայլ</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-[#004471] text-white rounded-xl text-sm font-semibold hover:bg-[#003560] transition-colors">
          <Plus size={16} /> Ավելացնել ֆայլ
        </button>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Որոնել ֆայլ..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
        </div>
        <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471] bg-white">
          <option value="">Բոլոր մասնagidzyunnery</option>
          {specialties.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <p className="text-gray-500">Բeռnvum e...</p> : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">Ֆayler chkan</div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([spec, files]) => (
            <div key={spec} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-[#004471] text-white text-sm font-bold flex items-center justify-between">
                <span>{spec}</span>
                <span className="text-blue-200 text-xs">{files.length} ֆayл</span>
              </div>
              <div className="divide-y divide-gray-100">
                {files.map(f => (
                  <div key={f._id} className="flex items-center gap-3 px-5 py-3">
                    <FileText size={18} className="text-[#004471] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{f.name}</p>
                      <p className="text-xs text-gray-400">{f.fileName} · {fmtSize(f.fileSize)} {!f.isPublished && '· Thakvac'}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <a href={`${SERVER}${f.filePath}`} download target="_blank" rel="noreferrer"
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Download size={14} /></a>
                      <button onClick={() => openEdit(f)} className="p-1.5 text-gray-400 hover:text-[#004471] hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => del(f._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-gray-900">{(editItem as any)._id ? 'Khmbagrel' : 'Avelacnel'} fayl</h2>
              <button onClick={close} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Fayli anvanutyun</label>
                <input value={editItem.name || ''} onChange={e => setEditItem(p => ({ ...p!, name: e.target.value }))}
                  placeholder="Anvanumner..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Masnagitvutyun <span className="text-red-500">*</span></label>
                <input value={editItem.specialty || ''} onChange={e => setEditItem(p => ({ ...p!, specialty: e.target.value }))}
                  list="spec-list" placeholder="Or. Bankayinn gorz"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
                <datalist id="spec-list">{specialties.map(s => <option key={s} value={s} />)}</datalist>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Fayl {!(editItem as any)._id && <span className="text-red-500">*</span>}
                </label>
                {(editItem as any)._id && (editItem as any).fileName && !newFile && (
                  <p className="text-xs text-gray-500 mb-1">Ayjm: {(editItem as any).fileName}</p>
                )}
                <input ref={fileRef} type="file" className="hidden" onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) { setNewFile(f); if (!editItem.name) setEditItem(p => ({ ...p!, name: f.name })); }
                }} />
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#004471] hover:text-[#004471] transition-colors w-full justify-center">
                  <Plus size={15} /> {newFile ? newFile.name : 'Entrel fayl'}
                </button>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Dasakarg (#)</label>
                  <input type="number" value={editItem.order || 0} onChange={e => setEditItem(p => ({ ...p!, order: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editItem.isPublished !== false} onChange={e => setEditItem(p => ({ ...p!, isPublished: e.target.checked }))} className="w-4 h-4 accent-[#004471]" />
                    <span className="text-sm font-medium text-gray-700">Hrapararkvac</span>
                  </label>
                </div>
              </div>
              {error && <p className="text-red-600 text-xs bg-red-50 rounded px-3 py-2">{error}</p>}
              <div className="flex gap-3">
                <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-[#004471] text-white rounded-lg font-semibold text-sm hover:bg-[#003560] disabled:opacity-60 transition-colors">
                  {saving ? 'Pahpanvum...' : 'Pahpanel'}
                </button>
                <button onClick={close} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm">Cheghark.</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
