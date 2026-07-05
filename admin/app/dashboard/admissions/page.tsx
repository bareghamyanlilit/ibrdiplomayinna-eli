// Dimordneri aghyusaki kararavarcman ej
// full ev remote tabs-ner ambyervum en dasavoracman hamar
// Inline form-y stexcum/arsknacnum e aghjusaki tolery
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

type Lang = 'am' | 'ru' | 'en';
type LText = { am: string; ru: string; en: string };
const emptyL = (): LText => ({ am: '', ru: '', en: '' });

interface Row {
  _id: string;
  specialty: LText;
  educationBase: LText;
  qualification: LText;
  subjects: LText;
  duration: LText;
  type: 'full' | 'remote';
  order: number;
}

const emptyRow = (): Omit<Row, '_id'> => ({
  specialty: emptyL(), educationBase: emptyL(), qualification: emptyL(),
  subjects: emptyL(), duration: emptyL(), type: 'full', order: 0,
});

const COLS = [
  { key: 'specialty', label: 'Մասնագիտություն' },
  { key: 'educationBase', label: 'Կրթական հիմք' },
  { key: 'qualification', label: 'Որակավորում' },
  { key: 'subjects', label: 'Ֆինանսավ. առարկաներ' },
  { key: 'duration', label: 'Ժամկետ' },
];

const LANGS: { code: Lang; label: string }[] = [
  { code: 'am', label: 'Հայ' }, { code: 'ru', label: 'Рус' }, { code: 'en', label: 'Eng' },
];

export default function AdmissionsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<Row> | null>(null);
  const [lang, setLang] = useState<Lang>('am');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'full' | 'remote'>('full');

  const load = () => api.get('/admissions').then(r => setItems(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditItem({ ...emptyRow() }); setError(''); };
  const openEdit = (item: Row) => { setEditItem({ ...item }); setError(''); };
  const close = () => { setEditItem(null); setError(''); };

  const setField = (field: string, l: Lang, val: string) =>
    setEditItem(p => ({ ...p!, [field]: { ...(p as any)[field], [l]: val } }));

  const save = async () => {
    if (!editItem?.specialty?.am) { setError('Հայերեն մասնագիտությունը պարտադիր է'); return; }
    setSaving(true); setError('');
    try {
      const body = {
        specialtyAm: editItem.specialty?.am, specialtyRu: editItem.specialty?.ru, specialtyEn: editItem.specialty?.en,
        educationBaseAm: editItem.educationBase?.am, educationBaseRu: editItem.educationBase?.ru, educationBaseEn: editItem.educationBase?.en,
        qualificationAm: editItem.qualification?.am, qualificationRu: editItem.qualification?.ru, qualificationEn: editItem.qualification?.en,
        subjectsAm: editItem.subjects?.am, subjectsRu: editItem.subjects?.ru, subjectsEn: editItem.subjects?.en,
        durationAm: editItem.duration?.am, durationRu: editItem.duration?.ru, durationEn: editItem.duration?.en,
        type: editItem.type || 'full',
        order: editItem.order || 0,
      };
      if ((editItem as any)._id) await api.put(`/admissions/${(editItem as any)._id}`, body);
      else await api.post('/admissions', body);
      close(); load();
    } catch (err: any) { setError(err?.response?.data?.message || 'Սխալ'); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Ջնջե՞լ տողը')) return;
    await api.delete(`/admissions/${id}`); load();
  };

  const filtered = items.filter(i => i.type === tab);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Դիմորդ — Ընդունելության աղյուսակ</h1>
          <p className="text-gray-500 text-sm">{items.length} տող</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-[#004471] text-white rounded-xl text-sm font-semibold hover:bg-[#003560] transition-colors">
          <Plus size={16} /> Ավելացնել տող
        </button>
      </div>

      {/* Tab: full / remote */}
      <div className="flex gap-2 mb-5">
        {[{ v: 'full', l: 'Առկա' }, { v: 'remote', l: 'Հեռակա' }].map(({ v, l }) => (
          <button key={v} onClick={() => setTab(v as any)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === v ? 'bg-[#004471] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {l}
          </button>
        ))}
      </div>

      {loading ? <p className="text-gray-500">Բեռնվում է...</p> : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">Տողեր չկան</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#003865] text-white text-xs">
                {COLS.map(c => <th key={c.key} className="px-4 py-3 font-semibold whitespace-nowrap">{c.label}</th>)}
                <th className="px-4 py-3 font-semibold">Ժ.</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row, i) => (
                <tr key={row._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {COLS.map(c => <td key={c.key} className="px-4 py-3 align-top">{(row as any)[c.key]?.am}</td>)}
                  <td className="px-4 py-3">{row.duration?.am}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(row)} className="p-1.5 text-gray-400 hover:text-[#004471] hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => del(row._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-gray-900">{(editItem as any)._id ? 'Խմբագրել' : 'Ավելացնել'} տող</h2>
              <button onClick={close} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Type */}
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-gray-700">Տեսակ:</span>
                {[{ v: 'full', l: 'Առկա' }, { v: 'remote', l: 'Հեռակա' }].map(({ v, l }) => (
                  <button key={v} type="button" onClick={() => setEditItem(p => ({ ...p!, type: v as any }))}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${editItem.type === v ? 'bg-[#004471] text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {l}
                  </button>
                ))}
              </div>

              {/* Lang tabs */}
              <div className="flex gap-1 border-b pb-3">
                {LANGS.map(({ code, label }) => (
                  <button key={code} type="button" onClick={() => setLang(code)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${lang === code ? 'bg-[#004471] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 gap-3">
                {COLS.map(col => (
                  <div key={col.key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{col.label} ({lang.toUpperCase()}){col.key === 'specialty' && lang === 'am' && <span className="text-red-500"> *</span>}</label>
                    <input value={(editItem as any)[col.key]?.[lang] || ''}
                      onChange={e => setField(col.key, lang, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Ժամկետ ({lang.toUpperCase()})</label>
                  <input value={editItem.duration?.[lang] || ''}
                    onChange={e => setField('duration', lang, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Դասակարգ (#)</label>
                  <input type="number" value={editItem.order || 0} onChange={e => setEditItem(p => ({ ...p!, order: Number(e.target.value) }))}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
                </div>
              </div>

              {error && <p className="text-red-600 text-xs bg-red-50 rounded px-3 py-2">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-[#004471] text-white rounded-lg font-semibold text-sm hover:bg-[#003560] disabled:opacity-60 transition-colors">
                  {saving ? 'Պահպանվում...' : 'Պահպանել'}
                </button>
                <button onClick={close} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors">Չեղ.</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
