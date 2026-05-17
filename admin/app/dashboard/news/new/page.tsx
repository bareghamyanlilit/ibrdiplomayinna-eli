// Nory norutyun stexcelu ej — PostForm component-ov
import PostForm from '@/components/PostForm';

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Նոր Գրառում</h1>
      <PostForm type="news" />
    </div>
  );
}
