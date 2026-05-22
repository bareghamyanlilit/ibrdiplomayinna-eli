'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

type Step = 'credentials' | 'code';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('epq_admin_token')) router.replace('/dashboard');
  }, [router]);

  const saveAndRedirect = (data: { token: string; admin: object }) => {
    localStorage.setItem('epq_admin_token', data.token);
    localStorage.setItem('epq_admin_user', JSON.stringify(data.admin));
    router.push('/dashboard');
  };

  // ─── Step 1: email + password ────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      saveAndRedirect(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; email?: string } } };
      const msg = axiosErr?.response?.data?.message;
      if (msg === 'wrong_password') {
        setError('Գաղտնաբառը սխալ է');
      } else {
        setError(msg || 'Սխալ տեղի ունեցավ');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── "Մոռացել եմ գաղտնաբառը" ────────────────────────────────
  const handleForgot = async () => {
    if (!email) { setError('Նախ մուտքագրեք Ձեր email-ը'); return; }
    setError(''); setLoading(true);
    try {
      await api.post('/auth/send-code', { email });
      setStep('code');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Սխալ տեղի ունեցավ');
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: կոդով մուտք ─────────────────────────────────────
  const handleCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login-with-code', { email, code });
      saveAndRedirect(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Սխալ կոդ');
    } finally {
      setLoading(false);
    }
  };

  // ─── Կոդի վերաուղարկում ───────────────────────────────────────
  const resendCode = async () => {
    setError(''); setLoading(true);
    try {
      await api.post('/auth/send-code', { email });
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

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#004471] rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">Է</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ԷՊՔ Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Էջմիածնի պետական քոլեջ</p>
        </div>

        {/* ── STEP 1: email + password ── */}
        {step === 'credentials' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Էլ. փոստ"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]"
            />
            <input
              type="password" required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Գաղտնաբառ"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#004471]"
            />
            {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#004471] text-white rounded-lg font-semibold text-sm hover:bg-[#003560] disabled:opacity-60 transition-colors">
              {loading ? 'Բեռնվում է...' : 'Մուտք գործել'}
            </button>
            <button type="button" onClick={handleForgot} disabled={loading}
              className="w-full text-center text-sm text-[#004471] hover:underline disabled:opacity-50">
              Մոռացել եմ գաղտնաբառը
            </button>
          </form>
        )}

        {/* ── STEP 2: կոդ ── */}
        {step === 'code' && (
          <form onSubmit={handleCodeLogin} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
              Verification կոդ է ուղարկվել <strong>{email}</strong> հասցեին
            </div>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-նիշ կոդ"
              maxLength={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-center tracking-widest text-xl focus:outline-none focus:ring-2 focus:ring-[#004471]"
            />
            {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#004471] text-white rounded-lg font-semibold text-sm hover:bg-[#003560] disabled:opacity-60 transition-colors">
              {loading ? 'Ստուգվում է...' : 'Մուտք գործել'}
            </button>
            <div className="flex justify-between text-sm">
              <button type="button" onClick={() => { setStep('credentials'); setError(''); setCode(''); }}
                className="text-gray-500 hover:text-gray-700">
                ← Վերադառնալ
              </button>
              <button type="button" onClick={resendCode} disabled={loading}
                className="text-[#004471] hover:underline disabled:opacity-50">
                Կոդը վերաուղարկել
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
