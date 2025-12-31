"use client";

import type { ReactNode } from "react";

interface BackgroundWrapperProps {
    children: ReactNode;
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
    // 모든 페이지에서 동일한 배경색 사용 (일관성 유지)
    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-50">
            {children}
        </div>
    );
}


