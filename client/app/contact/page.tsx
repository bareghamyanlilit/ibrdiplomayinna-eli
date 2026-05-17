// Kapi ej — Contact component render
import {Contact} from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact – Ejmiatsin Vardges Hamazaspyan State College",
  description:
    "Կապ հաստատիր Էջմիածնի Վարդգես Համազասպյանի անվան պետական քոլեջի հետ։ Հասցե, հեռախոս, էլ․ փոստ և աշխատանքային ժամեր։",
  openGraph: {
    title: "Contact – Ejmiatsin Vardges Hamazaspyan State College",
    description:
      "Կապ հաստատիր մեր քոլեջի հետ՝ տեղեկանալու ընդունելության, դասընթացների և այլ հարցերի մասին։",
    url: "https://www.epc.am/contact",
    siteName: "Vardges Hamazaspyan State College",
    images: [
      {
        url: "/img/logo.png",
        width: 1200,
        height: 630,
        alt: "Ejmiatsin College building",
      },
    ],
    locale: "hy_AM",
    type: "website",
  },
};

export default function page() {
  return (
    <Contact/>
  );
}
