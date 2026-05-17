import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ԷՊՔ Admin Panel',
  description: 'Admin panel for Ejmiatsin State College',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hy">
      <body>{children}</body>
    </html>
  );
}
