// Desktop navigation bar — mi dropdown mi zhamanak (openMenu state)
// Dropdown-y opacity transition-ov kavum ev anvanum e
// toggleMenu-y nuynyus link-y krocelu depqum fakvum e
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HeaderLink } from "@/utils/types";
import { P } from "./descr";
interface NavigationDesktopProps {
  headerLinks: HeaderLink[];
}
export function NavigationDesktop({ headerLinks }: NavigationDesktopProps) {
  const [activeLink, setActiveLink] = useState<string>("");
  const [openMenu, setOpenMenu] = useState<string | null>(null); // միայն մեկ բացված menu

  const toggleMenu = (link: string) => {
    setOpenMenu((prev) => (prev === link ? null : link)); // եթե նույնն է, փակել
  };

  return (
    <nav className="hidden lg:block">
      <ul className="flex gap-2 2xl:gap-3 font-medium">
        {headerLinks.map((item, i) => {
          if (Array.isArray(item)) {
            return (
              <li key={i}>
                <Link href={item[0]} onClick={() => setActiveLink(item[0])}>
                  <P
                    txt={item[1]}
                    className={`font-bold hover:text-[#9fd4ff] transition-colors duration-300 ${
                      activeLink === item[0] ? "text-[#9fd4ff]" : "text-white"
                    }`}
                  />
                </Link>
              </li>
            );
          }

          const link = item.link[0];
          const isOpen = openMenu === link; // միայն մեկ բացված menu

          return (
            <li key={i} className="relative">
              <div className="flex items-center cursor-pointer">
                <Link href={link} onClick={() => setActiveLink(link)}>
                  <P
                    txt={item.link[1]}
                    className={`font-bold hover:text-[#9fd4ff] transition-colors duration-300 ${
                      activeLink === link ? "text-[#9fd4ff]" : "text-white"
                    }`}
                  />
                </Link>
                <span onClick={() => toggleMenu(link)}>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </div>

              <ul
                className={`absolute left-0 mt-2 bg-[#004471] text-white rounded shadow-lg transition-opacity duration-300 z-10 ${
                  isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {item.children.map(([childHref, childName], j: number) => (
                  <li key={j}>
                    <Link
                      href={childHref}
                      className="block px-4 py-2 hover:bg-[#026eb6b2] whitespace-nowrap"
                      onClick={() => {
                        setActiveLink(childHref);
                        toggleMenu(link);
                      }}
                    >
                      {childName}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
