// Bolor dashboard ejeri pathul — token-i check localStorage-ic
// Ethe token chi ka, redirect arenq /login-in
// ok state-y pahum e children-nery render-el minchev check-y avartanum e
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('epq_admin_token');
    if (!token) {
      router.replace('/login');
    } else {
      setOk(true);
    }
  }, [router]);

  if (!ok) return null;
  return <>{children}</>;
}
