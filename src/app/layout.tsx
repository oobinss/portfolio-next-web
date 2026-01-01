import "./globals.css";
import MainHeader from "./components/main-header/main-header";
import Footer from "./components/footer/footer";
import ScrollToTop from "./components/common/scroll-to-top";
import SessionProviderWrapper from "../../lib/providers/sessionProviderWrapper";
import ReactQueryProvider from "../../lib/providers/reactQueryProvider";
import { ToastProvider } from "@/components/ui/toast";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import type { Session } from "next-auth";

export const metadata: Metadata = {
    title: "Portfolio Project - Next.js Web Application",
    description:
        "포트폴리오용 Next.js 웹 애플리케이션입니다. 게시판, 갤러리, 인증 기능을 포함한 풀스택 웹 애플리케이션입니다.",

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },

    alternates: {
        canonical: "https://your-portfolio.com",
    },

    openGraph: {
        type: "website",
        url: "https://your-portfolio.com",
        title: "Portfolio Project - Next.js Web Application",
        description:
            "포트폴리오용 Next.js 웹 애플리케이션입니다. 게시판, 갤러리, 인증 기능을 포함한 풀스택 웹 애플리케이션입니다.",
        siteName: "Portfolio Project",
        locale: "ko_KR",
        images: [
            {
                url: "https://your-portfolio.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Portfolio Project 대표 이미지",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Portfolio Project - Next.js Web Application",
        description:
            "포트폴리오용 Next.js 웹 애플리케이션입니다. 게시판, 갤러리, 인증 기능을 포함한 풀스택 웹 애플리케이션입니다.",
        images: ["https://your-portfolio.com/og-image.jpg"],
    },

    // 성능 최적화를 위한 메타데이터
    other: {
        "format-detection": "telephone=no",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#1c1917",
};

interface RootLayoutProps {
    children: ReactNode;
    session?: Session | null;
}

export default function RootLayout({ children, session }: RootLayoutProps) {
    return (
        <html lang="ko" className="scroll-smooth">
            <head>
                {/* 폰트 최적화: preconnect 및 preload 추가 */}
                <link
                    rel="preconnect"
                    href="https://cdn.jsdelivr.net"
                    crossOrigin="anonymous"
                />
                <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
                {/* 폰트 CSS 비동기 로딩 - 렌더링 블로킹 최소화 */}
                <link
                    rel="preload"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
                    as="style"
                    crossOrigin="anonymous"
                />
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
                    crossOrigin="anonymous"
                />
            </head>
            <body className="antialiased min-h-screen flex flex-col font-pretendard">
                <SessionProviderWrapper session={session}>
                    <ReactQueryProvider>
                        <ToastProvider />
                        <div className="w-full flex flex-col flex-1">
                            <MainHeader />
                            <main className="flex-grow">{children}</main>
                            <Footer />
                            <ScrollToTop />
                        </div>
                    </ReactQueryProvider>
                </SessionProviderWrapper>
            </body>
        </html>
    );
}
