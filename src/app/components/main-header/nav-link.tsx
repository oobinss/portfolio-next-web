"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface NavLinkProps {
    href: string;
    children: ReactNode;
    isMainPage?: boolean;
    onClick?: () => void;
}

export default function NavLink({ href, children, isMainPage = true, onClick }: NavLinkProps) {
    const path = usePathname();
    const isActive = path === href;

    const textColor = isMainPage
        ? (isActive ? "text-white" : "text-white/95 hover:text-white")
        : (isActive ? "text-stone-900" : "text-stone-600 hover:text-stone-900");

    const underlineColor = isMainPage ? "bg-white" : "bg-stone-900";

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "text-base font-medium transition-all duration-200 relative py-2 px-3 rounded-md",
                "md:py-0 md:px-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2",
                textColor,
                !isMainPage && "hover:bg-stone-50 md:hover:bg-transparent"
            )}
            aria-current={isActive ? "page" : false}
        >
            <span className="relative">
                {children}
                {isActive && (
                    <span className={cn(
                        "absolute -bottom-1 left-0 right-0 h-0.5 rounded-full hidden md:block",
                        underlineColor
                    )} />
                )}
            </span>
        </Link>
    );
}


