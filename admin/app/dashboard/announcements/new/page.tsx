// Nory haytararutyun stexcelu ej — PostForm component-ov
import PostForm from '@/components/PostForm';

export default function NewAnnouncementPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Նոր Հայտարարություն</h1>
      <PostForm type="announcements" />
    </div>
  );
}
