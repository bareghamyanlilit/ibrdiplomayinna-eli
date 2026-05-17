// Mеr Masin ej — vercnagir, nnkaragrutyun, Facebook video
// videoLoaded state-y pahum e loading placeholder-y anаranc video embed-i hamar
"use client";

import React, { useState } from "react";
import {H2} from "./title";
import {P} from "./descr";
import { useLanguage } from "@/context/LangContext";

export  function About() {
  const { data } = useLanguage();

  const [videoLoaded, setVideoLoaded] = useState(false);
  return (
    <div className="AboutPage  container w-[90%] sm:w-[80%] mx-auto">
      <div>
        <H2 txt={data.aboutInfo.title} className=" hidden sm:block" />
        <h4 className=" text-base font-bold sm:text-2xl py-4">
          {data.aboutInfo.title2}
        </h4>
        <P txt={data.aboutInfo.descr} className=" indent-10 text-justify" />

        {/* Video with placeholder */}
        <div className="relative w-full max-h-[150px] md:max-h-[600px] mt-12">
          {!videoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-lg z-10">
              Loading video...
            </div>
          )}
          <iframe
            src="https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/ejmiacni.petakan.k.olej/videos/2092955561144224&show_text=false&width=600"
            width="100%"
            height="600"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            onLoad={() => setVideoLoaded(true)}
          ></iframe>
        </div>
      </div>

    </div>
  );
}
