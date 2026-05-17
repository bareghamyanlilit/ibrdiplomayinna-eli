// Mobile navigation bar — hamajverkge shrji zhamanak havakvum e
// Submenu toggle-y bac e mi dropdown stanel
// isOpen prop-y kararum e knopy bac e te bac e
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HeaderLink } from "@/utils/types";

export function NavigationMobile({
  headerLinks,
  isOpen,
  setIsOpen,
}: {
  headerLinks: HeaderLink[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [activeLink, setActiveLink] = useState<string>("");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null); // միայն մեկ submenu բաց

  const toggleSubmenu = (link: string) => {
    setOpenSubmenu((prev) => (prev === link ? null : link));
  };

  return (
    <div
      className={`absolute w-[80%] left-[10%] lg:top-[100%] lg:hidden py-3 overflow-hidden transition-all duration-500 ${
        isOpen ? "max-h-[500px] bg-[#004471]" : "max-h-0"
      }`}
    >
      <ul className="flex flex-col text-center font-medium text-sm">
        {headerLinks.map((item, i) => {
          if (Array.isArray(item)) {
            const isActive = activeLink === item[0];
            return (
              <li key={i}>
                <Link
                  href={item[0]}
                  className={`block py-2 font-bold hover:underline text-white transition-colors duration-300 ${
                    isActive ? "text-[#008eff]" : "text-white"
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                    setActiveLink(item[0]);
                  }}
                >
                  {item[1]}
                </Link>
              </li>
            );
          }

          const link = item.link[0];
          const isSubOpen = openSubmenu === link;

          return (
            <li key={i} className="mt-2 text-left">
              <div className="flex gap-1 items-center justify-center">
                <button
                  className="w-full flex py-2 font-bold justify-center gap-2 items-center text-white"
                  onClick={() => toggleSubmenu(link)}
                >
                  {item.link[1]}
                  {isSubOpen ? (
                    <ChevronUp className="inline-block w-4 h-4" />
                  ) : (
                    <ChevronDown className="inline-block w-4 h-4" />
                  )}
                </button>
              </div>
              <ul
                className={`overflow-hidden transition-all duration-300 ${
                  isSubOpen ? "max-h-96" : "max-h-0"
                }`}
              >
                {item.children.map((child, j:number) => (
                  <li key={j}>
                    <Link
                      href={child[0]}
                      className="block py-2 pl-4 text-center text-white hover:text-[#008eff]"
                      onClick={() => {
                        setIsOpen(false);
                        setActiveLink(child[0]);
                        setOpenSubmenu(null);
                      }}
                    >
                      {child[1]}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
