
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HeaderLink } from "@/utils/types";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

interface Department {
    _id: string;
    shortTitle: {
        am: string;
        ru?: string;
        en?: string;
    };
}

export function NavigationMobile({
    headerLinks,
    isOpen,
    setIsOpen,
}: {
    headerLinks: HeaderLink[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}) {
    const [activeLink, setActiveLink] = useState("");
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const toggleSubmenu = (link: string) => {
        setOpenSubmenu((prev) => (prev === link ? null : link));
    };

    const closeMenu = () => {
        setIsOpen(false);
        setOpenSubmenu(null);
    };

    useEffect(() => {
        if (openSubmenu !== "departments" || departments.length > 0) {
            return;
        }

        const controller = new AbortController();

        const fetchDepartments = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API.replace(/\/$/, "")}/departments`,
                    { signal: controller.signal }
                );

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
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }

                setError(
                    err instanceof Error ? err.message : "Անհայտ սխալ"
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void fetchDepartments();

        return () => controller.abort();
    }, [openSubmenu, departments.length]);

    return (
        <div
            className={`absolute left-[10%] top-full z-50 w-[80%] overflow-hidden transition-all duration-500 lg:hidden ${
                isOpen
                    ? "max-h-[80vh] overflow-y-auto bg-[#004471] py-3 opacity-100"
                    : "max-h-0 py-0 opacity-0 pointer-events-none"
            }`}
        >
            <ul className="flex flex-col text-center text-sm font-medium">
                {headerLinks.map((item, i) => {
                    if (Array.isArray(item)) {
                        const isActive = activeLink === item[0];

                        return (
                            <li key={i}>
                                <Link
                                    href={item[0]}
                                    className={`block py-2 font-bold transition-colors duration-300 hover:text-[#008eff] ${
                                        isActive
                                            ? "text-[#008eff]"
                                            : "text-white"
                                    }`}
                                    onClick={() => {
                                        setActiveLink(item[0]);
                                        closeMenu();
                                    }}
                                >
                                    {item[1]}
                                </Link>
                            </li>
                        );
                    }

                    const link = item.link[0];

                    const isDepartments =
                        link.toLowerCase() === "/departments" ||
                        link.toLowerCase() === "departments";

                    const menuKey = isDepartments ? "departments" : link;
                    const isSubOpen = openSubmenu === menuKey;

                    return (
                        <li key={i} className="mt-2">
                            <div className="flex items-center justify-center">
                                <Link
                                    href={link}
                                    className={`py-2 font-bold transition-colors duration-300 hover:text-[#008eff] ${
                                        activeLink === link
                                            ? "text-[#008eff]"
                                            : "text-white"
                                    }`}
                                    onClick={() => {
                                        setActiveLink(link);
                                        closeMenu();
                                    }}
                                >
                                    {item.link[1]}
                                </Link>

                                <button
                                    type="button"
                                    aria-label={`Բացել ${item.link[1]} մենյուն`}
                                    aria-expanded={isSubOpen}
                                    className="p-2 text-white"
                                    onClick={() => toggleSubmenu(menuKey)}
                                >
                                    {isSubOpen ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            <ul
                                className={`overflow-hidden transition-all duration-300 ${
                                    isSubOpen
                                        ? "max-h-[70vh] overflow-y-auto py-1 opacity-100"
                                        : "max-h-0 opacity-0"
                                }`}
                            >
                                {isDepartments ? (
                                    <>
                                        {loading && (
                                            <li className="px-4 py-2 text-white">
                                                Բեռնում...
                                            </li>
                                        )}

                                        {error && (
                                            <li className="px-4 py-2 text-white">
                                                <p>{error}</p>
                                                <button
                                                    type="button"
                                                    className="mt-2 underline"
                                                    onClick={() => {
                                                        setDepartments([]);
                                                        setError("");
                                                        setOpenSubmenu(null);

                                                        setTimeout(() => {
                                                            setOpenSubmenu("departments");
                                                        }, 0);
                                                    }}
                                                >
                                                    Կրկին փորձել
                                                </button>
                                            </li>
                                        )}

                                        {!loading &&
                                            !error &&
                                            departments.map((department) => (
                                                <li key={department._id}>
                                                    <Link
                                                        href={`/departments/${department._id}`}
                                                        className="block whitespace-nowrap px-4 py-2 text-white hover:bg-[#026eb6b2] hover:text-[#008eff]"
                                                        onClick={() => {
                                                            setActiveLink(
                                                                `/departments/${department._id}`
                                                            );
                                                            closeMenu();
                                                        }}
                                                    >
                                                        {department.shortTitle?.am ||
                                                            department._id}
                                                    </Link>
                                                </li>
                                            ))}

                                        {!loading &&
                                            !error &&
                                            departments.length === 0 && (
                                                <li className="px-4 py-2 text-white">
                                                    Բաժիններ չկան
                                                </li>
                                            )}
                                    </>
                                ) : (
                                    item.children.map(
                                        ([childHref, childName], j) => (
                                            <li key={j}>
                                                <Link
                                                    href={childHref}
                                                    className={`block px-4 py-2 text-center transition-colors duration-300 hover:bg-[#026eb6b2] hover:text-[#008eff] ${
                                                        activeLink === childHref
                                                            ? "text-[#008eff]"
                                                            : "text-white"
                                                    }`}
                                                    onClick={() => {
                                                        setActiveLink(childHref);
                                                        closeMenu();
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
        </div>
    );
}
