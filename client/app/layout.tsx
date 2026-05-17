// Root layout — bolor ejery oktogutvum en aystegh
// LangProvider-y wrap arenq bolor children-nery lezvayin context-ov
// Header, Footer, BackToTop, Analytics ambyervum en bolor ejeri vra
// Metadata-y SEO hamar (Open Graph, Twitter Card, keywords)
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {BackToTop} from "@/components/TopButton";
import { LangProvider } from "@/context/LangContext";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Ejmiatsin Vardges Hamazaspyan State College – Official Website",
  description:
    "Learn at Ejmiatsin Vardges Hamazaspyan State College. Explore our programs, admission details, news, and campus life in Ejmiatsin, Armenia.",
  keywords: [
    "Ejmiatsin college",
    "Vardges Hamazaspyan",
    "education Armenia",
    "state college",
    "admission",
    "մասնագիտություններ",
    "քոլեջ Էջմիածին",
    "Հայաստան կրթություն",
    "կրթական ծրագրեր",
    "ejmiacni petakan qolej",
  ],
  openGraph: {
    title: "Ejmiatsin Vardges Hamazaspyan State College",
    description:
      "Explore our educational programs and learn at one of Armenia’s leading state colleges.",
    url: "https://epc.am", 
    siteName: "Vardges Hamazaspyan State College",
    images: [
      {
        url: "/img/logo.png", 
        width: 1200,
        height: 630,
        alt: "Ejmiatsin Vardges Hamazaspyan State College Campus",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ejmiatsin Vardges Hamazaspyan State College",
    description:
      "Official website of Ejmiatsin Vardges Hamazaspyan State College – explore programs and admission details.",
    images: ["/img/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://epc.am"), 
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className=" text-[#333] " style={{ whiteSpace: "pre-line" }}>
        <LangProvider>
          <Header />
          {children}
          <Analytics/>
          <BackToTop />
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
