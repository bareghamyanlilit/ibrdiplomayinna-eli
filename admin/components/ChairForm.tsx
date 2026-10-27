// Ambioni stexcelu/arsknacman form
// Boss-i anun, nkaragrutyun, lusankar
// Staff list (textarea-ic newline-separated)
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import LangTabs from '@/components/LangTabs';

type Lang = 'am' | 'ru' | 'en';
type LText = { am: string; ru: string; en: string };
const emptyL = (): LText => ({ am: '', ru: '', en: '' });
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;
const getImageUrl = (url: string) => {
  if (!url) return '';

  // Ամբողջական URL-ն օգտագործում ենք անփոփոխ
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const server = SERVER?.replace(/\/+$/, '');

  if (!server) {
    console.error('NEXT_PUBLIC_SERVER_URL is not configured');
    return url;
  }

  // Հեռացնում ենք ավելորդ staff/ նախածանցը
  const path = url.replace(/^\/+/, '').replace(/^staff\//, '');

  return `${server}/${path}`;
};
export default function ChairForm({ initial }: { initial?: any }) {
  const router = useRouter();
  const isEdit = !!initial?._id;
  const [title, setTitle] = useState<LText>(initial?.title || emptyL());
  const [descr, setDescr] = useState<LText>(initial?.descr || emptyL());
  const [bossName, setBossName] = useState(initial?.boss?.name || '');
  const [bossDescr, setBossDescr] = useState(initial?.boss?.descr || '');
  const [bossSrc, setBossSrc] = useState(initial?.boss?.src || '');
  const [bossFile, setBossFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState(initial?.img || '');
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [staff, setStaff] = useState<string>((initial?.staff || []).join('\n'));
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const uploadToCloudinary = async (
        file: File
      ): Promise<string> => {
        const { data: sign } = await api.post('/uploads/sign', {
          resourceType: 'image',
        });

        const cloudinaryForm = new FormData();
        cloudinaryForm.append('file', file);
        cloudinaryForm.append('api_key', sign.apiKey);
        cloudinaryForm.append('timestamp', String(sign.timestamp));
        cloudinaryForm.append('signature', sign.signature);
        cloudinaryForm.append('folder', sign.folder);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
          {
            method: 'POST',
            body: cloudinaryForm,
          }
        );

        const result = await response.json();

        if (!response.ok || !result.secure_url) {
          throw new Error(
            result.error?.message || 'Նկարի վերբեռնումը ձախողվեց'
          );
        }

        return result.secure_url;
      };

      // Վերբեռնում ենք միայն նոր ընտրված նկարները։
      const uploadedImgUrl = imgFile
        ? await uploadToCloudinary(imgFile)
        : imgUrl;

      const uploadedBossSrc = bossFile
        ? await uploadToCloudinary(bossFile)
        : bossSrc;

      const payload = {
        titleAm: title.am,
        titleRu: title.ru,
        titleEn: title.en,
        descrAm: descr.am,
        descrRu: descr.ru,
        descrEn: descr.en,
        bossName,
        bossDescr,
        bossSrc: uploadedBossSrc,
        imgUrl: uploadedImgUrl,
        staff,
        order: String(order),
      };

      if (isEdit) {
        await api.put(`/chairs/${initial._id}`, payload);
      } else {
        await api.post('/chairs', payload);
      }

      router.push('/dashboard/chairs');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Սխալ տեղի ունեցավ'
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-800 border-b pb-2">Անվանում և նկարագրություն</h3>
        <LangTabs>
          {(lang) => (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Անվանում ({lang.toUpperCase()}){lang === 'am' && <span className="text-red-500"> *</span>}</label>
                <input required={lang === 'am'} value={title[lang]} onChange={e => setTitle(p => ({ ...p, [lang]: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Նկարագրություն ({lang.toUpperCase()})</label>
                <textarea rows={6} value={descr[lang]} onChange={e => setDescr(p => ({ ...p, [lang]: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471] resize-y" />
              </div>
            </div>
          )}
        </LangTabs>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Դասակարգ</label>
          <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-800 border-b pb-2">Ամբիոնի վարիչ</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Անուն Ազգանուն</label>
            <input value={bossName} onChange={e => setBossName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Պաշտոն</label>
            <input value={bossDescr} onChange={e => setBossDescr(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Լուսանկար</label>
          {(bossSrc || bossFile) && <img src={bossFile ? URL.createObjectURL(bossFile) : getImageUrl(bossSrc)} className="w-20 h-20 object-cover rounded-lg mb-2 border" alt="" />}
          <input type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) setBossFile(e.target.files[0]); }} className="text-xs" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-800 border-b pb-2">Ամբիոնի պատկեր + Դասախոսների ցանկ</h3>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Card պատկեր</label>
          {(imgUrl || imgFile) && <img src={imgFile ? URL.createObjectURL(imgFile) : getImageUrl(imgUrl)} className="w-20 h-20 object-cover rounded-lg mb-2 border" alt="" />}
          <input type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) setImgFile(e.target.files[0]); }} className="text-xs" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Դասախոսների ցանկ (մեկ անուն = մեկ տող)</label>
          <textarea rows={10} value={staff} onChange={e => setStaff(e.target.value)} placeholder="Անուն Ազգանուն&#10;Անուն Ազգանուն&#10;..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471] resize-y font-mono" />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-3 bg-[#004471] text-white rounded-lg font-semibold text-sm hover:bg-[#003560] disabled:opacity-60 transition-colors">
          {loading ? 'Պահպանվում է...' : isEdit ? 'Թարմացնել' : 'Ստեղծել'}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors">
          Չեղարկել
        </button>
      </div>
    </form>
  );
}
