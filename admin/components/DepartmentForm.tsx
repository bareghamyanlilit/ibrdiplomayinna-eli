// Masnagitvutyuni stexcelu/arsknacman form (amenabarcr form)
// infoParts-y dinamik e — karenq avclacnel/jnjel masner
// childImg, video, images upload-ner
// LangTabs-y am/ru/en dzer-i hamar
'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import LangTabs from '@/components/LangTabs';
import { Plus, X, Upload } from 'lucide-react';

type Lang = 'am' | 'ru' | 'en';
type LText = { am: string; ru: string; en: string };

interface InfoPartLocal {
  imgFile?: File | null;
  imgUrl: string;
  title: LText;
  desc: LText;
}

interface Dept {
  _id?: string;
  color?: string;
  title?: LText;
  descr?: LText;
  shortTitle?: LText;
  video?: string;
  childImg?: string;
  infoParts?: { title: LText; info: any[] };
  images?: string[];
  partImgTitle?: LText;
  order?: number;
  isPublished?: boolean;
}

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;
const getImageUrl = (url: string) => {
  if (!url) return '';

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const server = SERVER?.replace(/\/+$/, '');

  if (!server) {
    console.error('NEXT_PUBLIC_SERVER_URL is not configured');
    return url;
  }

  let path = url.replace(/^\/+/, '');

  // Հեռացնում ենք սխալ staff/ նախածանցը
  path = path.replace(/^staff\//, '');

  return `${server}/${path}`;
};

const emptyLText = (): LText => ({ am: '', ru: '', en: '' });
interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  required?: boolean;
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
}: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471] resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]"
        />
      )}
    </div>
  );
}
export default function DepartmentForm({ initial }: { initial?: Dept }) {
  const router = useRouter();
  const isEdit = !!initial?._id;

  const [color, setColor] = useState(initial?.color || '#004471');
  const [title, setTitle] = useState<LText>(initial?.title || emptyLText());
  const [descr, setDescr] = useState<LText>(initial?.descr || emptyLText());
  const [shortTitle, setShortTitle] = useState<LText>(initial?.shortTitle || emptyLText());
  const [videoUrl, setVideoUrl] = useState(initial?.video || '');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [childImgUrl, setChildImgUrl] = useState(initial?.childImg || '');
  const [childImgFile, setChildImgFile] = useState<File | null>(null);
  const [infoPartsTitle, setInfoPartsTitle] = useState<LText>(initial?.infoParts?.title || emptyLText());
  const [infoParts, setInfoParts] = useState<InfoPartLocal[]>(
    (initial?.infoParts?.info || []).map((p: any) => ({ imgUrl: p.img || '', title: p.title || emptyLText(), desc: p.desc || emptyLText() }))
  );
  const [existingImages, setExistingImages] = useState<string[]>(initial?.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [partImgTitle, setPartImgTitle] = useState<LText>(initial?.partImgTitle || emptyLText());
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isPublished, setIsPublished] = useState(initial?.isPublished !== false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const imgInputRef = useRef<HTMLInputElement>(null);

  const setL = (setter: React.Dispatch<React.SetStateAction<LText>>, lang: Lang, val: string) =>
    setter(p => ({ ...p, [lang]: val }));

  const addInfoPart = () => setInfoParts(p => [...p, { imgUrl: '', title: emptyLText(), desc: emptyLText() }]);
  const removeInfoPart = (i: number) => setInfoParts(p => p.filter((_, idx) => idx !== i));
  const updateInfoPart = (i: number, field: string, lang: Lang, val: string) =>
    setInfoParts(p => p.map((part, idx) => idx === i ? { ...part, [field]: { ...(part as any)[field], [lang]: val } } : part));


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.am) {
      setError('Հայերեն անվանումը պարտադիր է');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Ֆայլը անմիջապես Cloudinary է ուղարկվում։
      const uploadToCloudinary = async (
        file: File,
        resourceType: 'image' | 'video'
      ): Promise<string> => {
        const { data: sign } = await api.post('/uploads/sign', {
          resourceType,
        });

        const cloudinaryForm = new FormData();
        cloudinaryForm.append('file', file);
        cloudinaryForm.append('api_key', sign.apiKey);
        cloudinaryForm.append('timestamp', String(sign.timestamp));
        cloudinaryForm.append('signature', sign.signature);
        cloudinaryForm.append('folder', sign.folder);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${sign.cloudName}/${resourceType}/upload`,
          {
            method: 'POST',
            body: cloudinaryForm,
          }
        );

        const result = await response.json();

        if (!response.ok || !result.secure_url) {
          throw new Error(
            result.error?.message || 'Ֆայլի վերբեռնումը ձախողվեց'
          );
        }

        return result.secure_url;
      };

      // Նոր ֆայլերը վերբեռնում ենք առանձին։
      const uploadedVideoUrl = videoFile
        ? await uploadToCloudinary(videoFile, 'video')
        : videoUrl;

      const uploadedChildImgUrl = childImgFile
        ? await uploadToCloudinary(childImgFile, 'image')
        : childImgUrl;

      const uploadedImageUrls = await Promise.all(
        newImageFiles.map((file) => uploadToCloudinary(file, 'image'))
      );

      // Բաժնի տվյալներն այլևս չեն պարունակում մեծ ֆայլեր։
      const payload = {
        color,
        titleAm: title.am,
        titleRu: title.ru,
        titleEn: title.en,
        descrAm: descr.am,
        descrRu: descr.ru,
        descrEn: descr.en,
        shortTitleAm: shortTitle.am,
        shortTitleRu: shortTitle.ru,
        shortTitleEn: shortTitle.en,
        videoUrl: uploadedVideoUrl,
        childImgUrl: uploadedChildImgUrl,
        partImgTitleAm: partImgTitle.am,
        partImgTitleRu: partImgTitle.ru,
        partImgTitleEn: partImgTitle.en,
        order: String(order),
        isPublished: String(isPublished),
        infoParts: JSON.stringify({
          title: infoPartsTitle,
          info: infoParts.map((p) => ({
            img: p.imgUrl,
            title: p.title,
            desc: p.desc,
          })),
        }),
        existingImages: [...existingImages, ...uploadedImageUrls],
      };

      if (isEdit) {
        await api.put(`/departments/${initial!._id}`, payload);
      } else {
        await api.post('/departments', payload);
      }

      router.push('/dashboard/departments');
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Basic Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-800 text-base border-b pb-2">Հիմնական տեղեկություններ</h3>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Գույն</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-gray-200" />
          <span className="text-sm text-gray-500">{color}</span>
        </div>
        <LangTabs>
          {(lang) => (
            <div className="space-y-3">
              <Field label={`Անվանում (${lang.toUpperCase()})`} required={lang === 'am'} value={title[lang]} onChange={(v: string) => setL(setTitle, lang, v)} />
              <Field label={`Կարճ անվանում (${lang.toUpperCase()})`} value={shortTitle[lang]} onChange={(v: string) => setL(setShortTitle, lang, v)} />
              <Field label={`Նկարագրություն (${lang.toUpperCase()})`} value={descr[lang]} onChange={(v: string) => setL(setDescr, lang, v)} multiline />
            </div>
          )}
        </LangTabs>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Դասակարգ (#)</label>
            <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="w-4 h-4 accent-[#004471]" />
              <span className="text-sm font-medium text-gray-700">Հրապարակված</span>
            </label>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-800 text-base border-b pb-2">Մեդիա</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Պատկեր (icon/card)</label>
            {childImgUrl && (
              <img
                src={childImgFile ? childImgUrl : getImageUrl(childImgUrl)}
                className="w-16 h-16 object-contain mb-2 border rounded"
                alt=""
              />
            )}
            <input type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) { setChildImgFile(e.target.files[0]); setChildImgUrl(URL.createObjectURL(e.target.files[0])); } }} className="w-full text-xs" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Տեսանյութ (mp4)</label>
            {videoUrl && !videoFile && <p className="text-xs text-gray-400 mb-1 truncate">{videoUrl}</p>}
            <input type="file" accept="video/mp4,video/*" onChange={e => { if (e.target.files?.[0]) setVideoFile(e.target.files[0]); }} className="w-full text-xs" />
          </div>
        </div>
      </div>

      {/* Info Parts */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-800 text-base border-b pb-2">Բաժնի info մասեր</h3>
        <LangTabs>
          {(lang) => (
            <Field label={`Բաժնի վերնագիր (${lang.toUpperCase()})`} value={infoPartsTitle[lang]} onChange={(v: string) => setL(setInfoPartsTitle, lang, v)} />
          )}
        </LangTabs>
        {infoParts.map((part, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 relative">
            <button type="button" onClick={() => removeInfoPart(i)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors">
              <X size={16} />
            </button>
            <p className="text-xs font-bold text-gray-500">Info Part #{i + 1}</p>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Նկար URL կամ վերբեռնիր</label>
              <input value={part.imgUrl} onChange={e => setInfoParts(p => p.map((x, idx) => idx === i ? { ...x, imgUrl: e.target.value } : x))} placeholder="https://..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471] mb-1" />
            </div>
            <LangTabs>
              {(lang) => (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Վերնագիր ({lang.toUpperCase()})</label>
                    <input value={part.title[lang]} onChange={e => updateInfoPart(i, 'title', lang, e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Նկարագրություն ({lang.toUpperCase()})</label>
                    <textarea rows={3} value={part.desc[lang]} onChange={e => updateInfoPart(i, 'desc', lang, e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471] resize-y" />
                  </div>
                </div>
              )}
            </LangTabs>
          </div>
        ))}
        <button type="button" onClick={addInfoPart} className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#004471] hover:text-[#004471] transition-colors w-full justify-center">
          <Plus size={15} /> Ավելացնել info մաս
        </button>
      </div>

      {/* Gallery images */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-800 text-base border-b pb-2">Գալերեա (ցուցադրվող նկարներ)</h3>
        <LangTabs>
          {(lang) => (
            <Field label={`Գալերեայի վերնագիր (${lang.toUpperCase()})`} value={partImgTitle[lang]} onChange={(v: string) => setL(setPartImgTitle, lang, v)} />
          )}
        </LangTabs>
        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {existingImages.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={getImageUrl(img)}
                  className="w-20 h-20 object-cover rounded-lg border"
                  alt=""
                />
                <button type="button" onClick={() => setExistingImages(p => p.filter((_, idx) => idx !== i))}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        {newImageFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {newImageFiles.map((f, i) => (
              <div key={i} className="relative group">
                <img src={URL.createObjectURL(f)} className="w-20 h-20 object-cover rounded-lg border border-dashed border-blue-300" alt="" />
                <button type="button" onClick={() => setNewImageFiles(p => p.filter((_, idx) => idx !== i))}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        <button type="button" onClick={() => imgInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#004471] hover:text-[#004471] transition-colors">
          <Upload size={15} /> Ավելացնել նկար
        </button>
        <input ref={imgInputRef} type="file" multiple accept="image/*" className="hidden"
          onChange={e => { if (e.target.files) setNewImageFiles(p => [...p, ...Array.from(e.target.files!)]); }} />
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
