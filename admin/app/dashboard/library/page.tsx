// Gradrani faileri kararavarcman ej
// File upload FormData-ov, masnagitvutyun meta
// Failery khmbavorvum en specialty-ov, edit-y inline e
'use client';
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X, Download, FileText, Search } from 'lucide-react';

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

type Lang = 'am' | 'ru' | 'en';
const LANG_LABELS: Record<Lang, string> = { am: 'Հայերեն', ru: 'Русский', en: 'English' };

interface LocalizedText { am: string; ru: string; en: string; }

interface LibFile {
  _id: string; name: LocalizedText; specialty: LocalizedText; fileName: string;
  filePath: string; fileSize: number; mimeType: string; isPublished: boolean; order: number;
}

interface EditItem {
  _id?: string; name: LocalizedText; specialty: LocalizedText; fileName?: string;
  filePath?: string; fileSize?: number; mimeType?: string; isPublished: boolean; order: number;
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
  const [editItem, setEditItem] = useState<EditItem | null>(null);
  const [activeLang, setActiveLang] = useState<Lang>('am');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api.get('/library/admin').then(r => setItems(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const getSpecKey = (s: any) => typeof s === 'string' ? s : (s?.am || '');
  const specialties = [...new Map(items.map(i => [getSpecKey(i.specialty), i.specialty])).values()];
  const filtered = items.filter(i => {
    const displayName = typeof i.name === 'string' ? i.name : (i.name?.am || '');
    const ms = !search || displayName.toLowerCase().includes(search.toLowerCase()) || i.fileName?.toLowerCase().includes(search.toLowerCase());
    const msp = !filterSpec || getSpecKey(i.specialty) === filterSpec;
    return ms && msp;
  });

  const openNew = () => { setEditItem({ name: { am: '', ru: '', en: '' }, specialty: { am: '', ru: '', en: '' }, isPublished: true, order: 0 }); setActiveLang('am'); setNewFile(null); setError(''); };
  const openEdit = (item: LibFile) => {
    const spec = typeof item.specialty === 'string' ? { am: item.specialty as string, ru: '', en: '' } : { ...item.specialty };
    setEditItem({ ...item, name: typeof item.name === 'string' ? { am: item.name as string, ru: '', en: '' } : { ...item.name }, specialty: spec });
    setActiveLang('am'); setNewFile(null); setError('');
  };
  const close = () => { setEditItem(null); setNewFile(null); setError(''); };

  const save = async () => {
    if (!editItem?.specialty?.am) { setError('Մասնագիտությունը պարտադիր է'); return; }
    if (!editItem._id && !newFile) { setError('Ֆայլ ընտրեք'); return; }
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      fd.append('nameAm', editItem.name.am || newFile?.name || '');
      fd.append('nameRu', editItem.name.ru || '');
      fd.append('nameEn', editItem.name.en || '');
      fd.append('specialtyAm', editItem.specialty.am);
      fd.append('specialtyRu', editItem.specialty.ru || editItem.specialty.am);
      fd.append('specialtyEn', editItem.specialty.en || editItem.specialty.am);
      fd.append('order', String(editItem.order || 0));
      fd.append('isPublished', String(editItem.isPublished !== false));
      if (newFile) fd.append('file', newFile);
      if (editItem._id) await api.put(`/library/${editItem._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
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
    const k = getSpecKey(item.specialty);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
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
          <option value="">Բոլոր մասնագիտություններ</option>
          {specialties.map((s, i) => { const v = typeof s === 'string' ? s : (s as any).am || ''; return <option key={i} value={v}>{v}</option>; })}
        </select>
      </div>

      {loading ? <p className="text-gray-500">Բեռնվում է ...</p> : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">Ֆայլեր չկան</div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([spec, files]) => (
            <div key={spec} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-[#004471] text-white text-sm font-bold flex items-center justify-between">
                <span>{spec}</span>
                <span className="text-blue-200 text-xs">{files.length} ֆայլ</span>
              </div>
              <div className="divide-y divide-gray-100">
                {files.map(f => (
                  <div key={f._id} className="flex items-center gap-3 px-5 py-3">
                    <FileText size={18} className="text-[#004471] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{typeof f.name === 'string' ? f.name : (f.name?.am || f.fileName)}</p>
                      <p className="text-xs text-gray-400">{f.fileName} · {fmtSize(f.fileSize)} {!f.isPublished && '· Թաքցված'}</p>
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
              <h2 className="font-bold text-gray-900">{editItem._id ? 'Խմբագրել' : 'Ավելացնել'} ֆայլ</h2>
              <button onClick={close} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Language tabs for name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Ֆայլի անվանում (ըստ լեզվի)</label>
                <div className="flex gap-1 mb-2">
                  {(['am', 'ru', 'en'] as Lang[]).map((l) => (
                    <button key={l} type="button" onClick={() => setActiveLang(l)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeLang === l ? 'bg-[#004471] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {LANG_LABELS[l]}
                    </button>
                  ))}
                </div>
                {(['am', 'ru', 'en'] as Lang[]).map((l) => (
                  <div key={l} className={activeLang === l ? 'block' : 'hidden'}>
                    <input
                      value={editItem.name[l]}
                      onChange={e => setEditItem(p => p ? { ...p, name: { ...p.name, [l]: e.target.value } } : p)}
                      placeholder={`Անվանում ${LANG_LABELS[l]}-ով`}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Մասնագիտություն <span className="text-red-500">*</span></label>
                {(['am', 'ru', 'en'] as Lang[]).map((l) => (
                  <div key={l} className={activeLang === l ? 'block' : 'hidden'}>
                    <input
                      value={editItem.specialty[l]}
                      onChange={e => setEditItem(p => p ? { ...p, specialty: { ...p.specialty, [l]: e.target.value } } : p)}
                      list={`spec-list-${l}`}
                      placeholder={`Մասնամասնական ${LANG_LABELS[l]}-ով`}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]"
                    />
                    <datalist id={`spec-list-${l}`}>
                      {specialties.map((s, i) => <option key={i} value={typeof s === 'string' ? s : (s as any)[l] || ''} />)}
                    </datalist>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Ֆայլ {!editItem._id && <span className="text-red-500">*</span>}
                </label>
                {editItem._id && editItem.fileName && !newFile && (
                  <p className="text-xs text-gray-500 mb-1">Այժմ : {editItem.fileName}</p>
                )}
                <input ref={fileRef} type="file" className="hidden" onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) { setNewFile(f); if (!editItem.name.am) setEditItem(p => p ? { ...p, name: { ...p.name, am: f.name } } : p); }
                }} />
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#004471] hover:text-[#004471] transition-colors w-full justify-center">
                  <Plus size={15} /> {newFile ? newFile.name : 'Ընտրել ֆայլը'}
                </button>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Դասակարգ (#)</label>
                  <input type="number" value={editItem.order || 0} onChange={e => setEditItem(p => ({ ...p!, order: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editItem.isPublished !== false} onChange={e => setEditItem(p => ({ ...p!, isPublished: e.target.checked }))} className="w-4 h-4 accent-[#004471]" />
                    <span className="text-sm font-medium text-gray-700">Հրապարակված</span>
                  </label>
                </div>
              </div>
              {error && <p className="text-red-600 text-xs bg-red-50 rounded px-3 py-2">{error}</p>}
              <div className="flex gap-3">
                <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-[#004471] text-white rounded-lg font-semibold text-sm hover:bg-[#003560] disabled:opacity-60 transition-colors">
                  {saving ? 'Պահպանում...' : 'Պահպանել'}
                </button>
                <button onClick={close} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm">Չեղարկել</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}