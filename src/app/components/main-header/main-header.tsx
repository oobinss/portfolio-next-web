"use client";

import { useState } from "react";
import Link from "next/link";
import NavLink from "./nav-link";
import AuthHeader from "./auth-header";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainHeader() {
    const pathname = usePathname();
    const isMainPage = pathname === "/";
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // 메인 페이지가 아닌 경우 relative로 변경하여 배너 위에 표시
    const headerClass = isMainPage
        ? "absolute top-0 left-0 w-full z-30"
        : "relative w-full z-30";

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className={headerClass}>
            {/* 통합 헤더 */}
            <div
                className={
                    isMainPage
                        ? "backdrop-blur-lg bg-gradient-to-b from-black/40 via-black/30 to-black/20 border-b border-white/20"
                        : "bg-white border-b border-stone-200 shadow-sm"
                }
            >
                {/* 로그인/회원가입/로그아웃 */}
                <div
                    className="border-b border-white/10"
                    style={
                        !isMainPage ? { backgroundColor: "#0F100F" } : undefined
                    }
                >
                    <AuthHeader isMainPage={isMainPage} />
                </div>

                {/* 네비게이션 바 */}
                <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/"
                        className="select-none group"
                        onClick={closeMobileMenu}
                        aria-label="Portfolio Project 홈페이지로 이동"
                    >
                        <span
                            className={`text-2xl sm:text-3xl font-bold tracking-tight transition-all group-hover:scale-105 inline-block ${
                                isMainPage
                                    ? "text-white drop-shadow-2xl"
                                    : "text-stone-900"
                            }`}
                        >
                            Portfolio Project
                        </span>
                    </Link>

                    {/* 데스크톱 네비게이션 */}
                    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <NavLink href="/company" isMainPage={isMainPage}>
                            포트폴리오 소개
                        </NavLink>
                        <NavLink href="/gallery" isMainPage={isMainPage}>
                            프로젝트 갤러리
                        </NavLink>
                        <NavLink href="/board" isMainPage={isMainPage}>
                            질문 게시판
                        </NavLink>
                        <NavLink href="/contact" isMainPage={isMainPage}>
                            문의하기
                        </NavLink>
                    </nav>

                    {/* 모바일 메뉴 버튼 */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`md:hidden ${
                            isMainPage
                                ? "text-white hover:bg-white/15"
                                : "text-stone-900 hover:bg-stone-50"
                        }`}
                        onClick={toggleMobileMenu}
                        aria-label="메뉴 열기"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        )}
                    </Button>
                </div>

                {/* 모바일 네비게이션 메뉴 */}
                {mobileMenuOpen && (
                    <nav
                        className={`md:hidden border-t ${
                            isMainPage
                                ? "border-white/20 bg-black/40 backdrop-blur-lg"
                                : "border-stone-200 bg-white"
                        }`}
                        aria-label="모바일 메뉴"
                    >
                        <div className="px-4 py-4 space-y-2">
                            <NavLink
                                href="/company"
                                isMainPage={isMainPage}
                                onClick={closeMobileMenu}
                            >
                                포트폴리오 소개
                            </NavLink>
                            <NavLink
                                href="/gallery"
                                isMainPage={isMainPage}
                                onClick={closeMobileMenu}
                            >
                                프로젝트 갤러리
                            </NavLink>
                            <NavLink
                                href="/board"
                                isMainPage={isMainPage}
                                onClick={closeMobileMenu}
                            >
                                질문 게시판
                            </NavLink>
                            <NavLink
                                href="/contact"
                                isMainPage={isMainPage}
                                onClick={closeMobileMenu}
                            >
                                문의하기
                            </NavLink>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
