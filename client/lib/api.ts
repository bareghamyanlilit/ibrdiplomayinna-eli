// API-i base URL-y .env-ic (lranaguyts` localhost:5000/api)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
// Server URL-y nkarnery ev failery download anel hamar
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// Bolor hryatarakac haytararutyunnery stanel (60 varkyan revalidation-ov)
export async function fetchAnnouncements() {
  try {
    const res = await fetch(`${API_URL}/announcements`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

// Bolor hryatarakac norutyunnery stanel (60 varkyan revalidation-ov)
export async function fetchNews() {
  try {
    const res = await fetch(`${API_URL}/news`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

// Mek haytararutyun stanel id-ov (dinamik ej hamar, cache chi)
export async function fetchAnnouncementById(id: string) {
  try {
    const res = await fetch(`${API_URL}/announcements/${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// Mek norutyun stanel id-ov
export async function fetchNewsById(id: string) {
  try {
    const res = await fetch(`${API_URL}/news/${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}
