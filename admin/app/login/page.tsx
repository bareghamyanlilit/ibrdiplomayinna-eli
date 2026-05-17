// Admin login/register ej
// tab state-y poxum e login ev register form-neri
// handle() function-y POST e /api/auth/login kkam /api/auth/register
// Token-y pahvum e localStorage-um (epq_admin_token)
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('epq_admin_token')) router.replace('/dashboard');
  }, [router]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = tab === 'login' ? { email: form.email, password: form.password } : form;
      const { data } = await api.post(`/auth/${tab === 'login' ? 'login' : 'register'}`, payload);
      localStorage.setItem('epq_admin_token', data.token);
      localStorage.setItem('epq_admin_user', JSON.stringify(data.admin));
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Սխալ տեղի ունեցավ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004471] to-[#002d4d] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#004471] rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">Է</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ԷՊՔ Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Էջմիածնի պետական քոլեջ</p>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          {(['login', 'register'] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${tab === t ? 'bg-white shadow text-[#004471]' : 'text-gray-500'}`}>
              {t === 'login' ? 'Մուտք' : 'Գրանցում'}
            </button>
          ))}
        </div>

        <form onSubmit={handle} className="space-y-4">
          {tab === 'register' && (
            <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Անուն Ազգանուն"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
          )}
          <input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Էլ. փոստ"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
          <input type="password" required value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            placeholder="Գաղտնաբառ"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]" />
          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[#004471] text-white rounded-lg font-semibold text-sm hover:bg-[#003560] disabled:opacity-60 transition-colors">
            {loading ? 'Բեռնվում է...' : tab === 'login' ? 'Մուտք գործել' : 'Գրանցվել'}
          </button>
        </form>
      </div>
    </div>
  );
}
