
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HeaderLink } from "@/utils/types";
import { P } from "./descr";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";
interface NavigationDesktopProps {
  headerLinks: HeaderLink[];
}

interface Department {
  _id: string;
  shortTitle: {
    am: string;
    ru?: string;
    en?: string;
  };
}

export function NavigationDesktop({
  headerLinks,
}: NavigationDesktopProps) {
  const [activeLink, setActiveLink] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleMenu = (link: string) => {
    setOpenMenu((prev) => (prev === link ? null : link));
  };

  useEffect(() => {
    if (openMenu !== "departments" || departments.length > 0) {
      return;
    }

    const fetchDepartments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API}/departments`);

        if (!response.ok) {
          throw new Error("Չհաջողվեց բեռնել բաժինները");
        }

        const data = await response.json();

        const result = Array.isArray(data)
          ? data
          : data.departments;

        if (!Array.isArray(result)) {
          throw new Error("API-ի պատասխանի ձևաչափը սխալ է");
        }

        setDepartments(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Անհայտ սխալ"
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchDepartments();
  }, [openMenu, departments.length]);

  return (
    <nav className="hidden lg:block">
      <ul className="flex gap-2 2xl:gap-3 font-medium">
        {headerLinks.map((item, i) => {
          if (Array.isArray(item)) {
            return (
              <li key={i}>
                <Link
                  href={item[0]}
                  onClick={() =>
                    setActiveLink(item[0])
                  }
                >
                  <P
                    txt={item[1]}
                    className={`font-bold hover:text-[#9fd4ff] transition-colors duration-300 ${activeLink === item[0]
                        ? "text-[#9fd4ff]"
                        : "text-white"
                      }`}
                  />
                </Link>
              </li>
            );
          }

          const link = item.link[0];

          const isDepartments =
            link.toLowerCase() === "/departments" ||
            link.toLowerCase() === "departments";

          const menuKey = isDepartments
            ? "departments"
            : link;

          const isOpen = openMenu === menuKey;

          return (
            <li key={i} className="relative">
              <div className="flex items-center cursor-pointer">
                <Link
                  href={link}
                  onClick={() =>
                    setActiveLink(link)
                  }
                >
                  <P
                    txt={item.link[1]}
                    className={`font-bold hover:text-[#9fd4ff] transition-colors duration-300 ${activeLink === link
                        ? "text-[#9fd4ff]"
                        : "text-white"
                      }`}
                  />
                </Link>

                <button
                  type="button"
                  aria-label="Բացել մենյուն"
                  aria-expanded={isOpen}
                  onClick={() => toggleMenu(menuKey)}
                  className="p-1"
                >
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>


              <ul
                className={`absolute left-0 top-full mt-2 min-w-max overflow-hidden rounded bg-[#004471] text-white shadow-lg z-10 transition-all duration-300 ${isOpen
                    ? "max-h-[500px] opacity-100 visible"
                    : "max-h-0 opacity-0 invisible pointer-events-none"
                  }`}
              >

                {isDepartments ? (
                  <>
                    {loading && (
                      <li className="px-4 py-2">
                        Բեռնում...
                      </li>
                    )}

                    {error && (
                      <li className="px-4 py-2">
                        <p>{error}</p>
                        <button
                          type="button"
                          className="underline"
                          onClick={() => {
                            setDepartments([]);
                            setOpenMenu(null);
                            setTimeout(
                              () =>
                                setOpenMenu(
                                  "departments"
                                ),
                              0
                            );
                          }}
                        >
                          Կրկին փորձել
                        </button>
                      </li>
                    )}

                    {!loading &&
                      !error &&
                      departments.map(
                        (department) => (
                          <li key={department._id}>
                            <Link
                              href={`/departments/${department._id}`}
                              className="block px-4 py-2 hover:bg-[#026eb6b2] whitespace-nowrap"
                              onClick={() => {
                                setActiveLink(
                                  `/departments/${department._id}`
                                );
                                setOpenMenu(null);
                              }}
                            >
                              {department.shortTitle?.am ||
                                department._id}
                            </Link>
                          </li>
                        )
                      )}

                    {!loading &&
                      !error &&
                      departments.length === 0 && (
                        <li className="px-4 py-2">
                          Բաժիններ չկան
                        </li>
                      )}
                  </>
                ) : (
                  item.children.map(
                    ([childHref, childName], j: number) => (
                      <li key={j}>
                        <Link
                          href={childHref}
                          className="block px-4 py-2 hover:bg-[#026eb6b2] whitespace-nowrap"
                          onClick={() => {
                            setActiveLink(childHref);
                            setOpenMenu(null);
                          }}
                        >
                          {childName}
                        </Link>
                      </li>
                    )
                  )
                )}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}