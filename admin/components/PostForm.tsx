// Reusable form haytararutyunneri ev norutyunneri hamar
// LangTabs-y ogtagurvum e am/ru/en dzer-i hamar
// Image preview + existing images pahel ev jnjel
// Video URL field ev upToDate (haytararutyunneri hamar)
'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { X, Upload, Plus } from 'lucide-react';

type Lang = 'am' | 'ru' | 'en';

interface LocalizedText {
  am: string;
  ru: string;
  en: string;
}

interface Post {
  _id?: string;
  title: LocalizedText;
  content: LocalizedText;
  video?: string;
  images?: string[];
  upToDate?: string;
  isPublished?: boolean;
}

interface PostFormProps {
  type: 'announcements' | 'news';
  initial?: Post;
}

const LANG_LABELS: Record<Lang, string> = { am: 'Հայերեն', ru: 'Русский', en: 'English' };
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export default function PostForm({ type, initial }: PostFormProps) {
  const router = useRouter();
  const isEdit = !!initial?._id;
  const fileRef = useRef<HTMLInputElement>(null);

  const [activeLang, setActiveLang] = useState<Lang>('am');
  const [title, setTitle] = useState<LocalizedText>(initial?.title || { am: '', ru: '', en: '' });
  const [content, setContent] = useState<LocalizedText>(initial?.content || { am: '', ru: '', en: '' });
  const [video, setVideo] = useState(initial?.video || '');
  const [upToDate, setUpToDate] = useState(initial?.upToDate || '');
  const [isPublished, setIsPublished] = useState(initial?.isPublished !== false);
  const [existingImages, setExistingImages] = useState<string[]>(initial?.images || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.am || !content.am) { setError('Հայերեն վերնագիրն ու բովանդակությունը պարտադիր են'); return; }
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('titleAm', title.am);
      fd.append('titleRu', title.ru);
      fd.append('titleEn', title.en);
      fd.append('contentAm', content.am);
      fd.append('contentRu', content.ru);
      fd.append('contentEn', content.en);
      fd.append('video', video);
      fd.append('isPublished', String(isPublished));
      if (type === 'announcements') fd.append('upToDate', upToDate);
      existingImages.forEach((img) => fd.append('existingImages', img));
      newFiles.forEach((f) => fd.append('images', f));

      if (isEdit) {
        await api.put(`/${type}/${initial!._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post(`/${type}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      router.push(`/dashboard/${type}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Սխալ տեղի ունեցավ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Language Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex gap-2 border-b pb-3">
          {(['am', 'ru', 'en'] as Lang[]).map((l) => (
            <button key={l} type="button" onClick={() => setActiveLang(l)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeLang === l ? 'bg-[#004471] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>

        {(['am', 'ru', 'en'] as Lang[]).map((l) => (
          <div key={l} className={activeLang === l ? 'space-y-3' : 'hidden'}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Վերնագիր ({LANG_LABELS[l]}) {l === 'am' && <span className="text-red-500">*</span>}
              </label>
              <input
                value={title[l]}
                onChange={(e) => setTitle((p) => ({ ...p, [l]: e.target.value }))}
                placeholder={`Վերնագիր ${LANG_LABELS[l]}-ով`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Բովանդակություն ({LANG_LABELS[l]}) {l === 'am' && <span className="text-red-500">*</span>}
              </label>
              <textarea
                rows={8}
                value={content[l]}
                onChange={(e) => setContent((p) => ({ ...p, [l]: e.target.value }))}
                placeholder={`Բովանդակություն ${LANG_LABELS[l]}-ով`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471] resize-y"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Video + Meta */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">Լրացուցիչ տեղեկություններ</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (Facebook/YouTube embed)</label>
          <input value={video} onChange={(e) => setVideo(e.target.value)}
            placeholder="https://www.facebook.com/plugins/video.php?..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
        </div>
        {type === 'announcements' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ակտուալ է մինչև</label>
            <input value={upToDate} onChange={(e) => setUpToDate(e.target.value)} placeholder="2025 December 31"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
          </div>
        )}
        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 accent-[#004471]" />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">Հրապարակված</label>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">Նկարներ</h3>
        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img, i) => (
              <div key={i} className="relative group">
                <img src={`${SERVER_URL}${img}`} alt="" className="w-24 h-24 object-cover rounded-lg border" onError={(e) => { (e.target as HTMLImageElement).src = img; }} />
                <button type="button" onClick={() => setExistingImages((p) => p.filter((_, idx) => idx !== i))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        {newFiles.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {newFiles.map((f, i) => (
              <div key={i} className="relative group">
                <img src={URL.createObjectURL(f)} alt="" className="w-24 h-24 object-cover rounded-lg border border-dashed border-blue-300" />
                <button type="button" onClick={() => setNewFiles((p) => p.filter((_, idx) => idx !== i))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        <button type="button" onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#004471] hover:text-[#004471] transition-colors">
          <Upload size={16} />
          Ավելացնել նկար
        </button>
        <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
          onChange={(e) => { if (e.target.files) setNewFiles((p) => [...p, ...Array.from(e.target.files!)]); }} />
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="px-6 py-3 bg-[#004471] text-white rounded-lg font-semibold text-sm hover:bg-[#003560] disabled:opacity-60 transition-colors">
          {loading ? 'Պահպանվում է...' : isEdit ? 'Թարմացնել' : 'Ստեղծել'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors">
          Չեղարկել
        </button>
      </div>
    </form>
  );
}
