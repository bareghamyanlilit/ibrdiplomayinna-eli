// "Verev veradardnal" knop — erjankut havasum e, ethe user-y scroll a 200px-ic vel
// useCallback-ov optimize enq scroll handler-y (memoized)
// CSS transition-ov havakvum/anvanum e knopy
"use client";

import { useEffect, useState, useCallback } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  const onScroll = useCallback(() => {
    setVisible(window.scrollY >= 200);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      aria-label="Back to top"
      onClick={scrollToTop}
      className={[
        "fixed bottom-6 right-6 z-50",
        "rounded-full shadow-lg border-0",
        "backdrop-blur bg-[#004471] hover:bg-[#004471d8] hover:cursor-pointer ",
        "text-white h-12 w-12 flex items-center justify-center",
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none",
      ].join(" ")}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
