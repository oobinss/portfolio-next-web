import BackgroundWrapper from "../components/common/backgroundWrapper";
import Image from "next/image";
import type { ReactNode } from "react";

interface GalleryLayoutProps {
    children: ReactNode;
}

export default function GalleryLayout({ children }: GalleryLayoutProps) {
    return (
        <BackgroundWrapper>
            <div className="relative w-full h-[450px] bg-black flex items-center justify-center overflow-hidden">
                <Image
                    src="/main-image.jpg"
                    alt="갤러리 상세 배너"
                    width={1200}
                    height={400}
                    priority
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
            </div>
            <main className="w-full max-w-7xl mx-auto py-14 px-4 md:px-6 flex flex-col gap-10">
                {children}
            </main>
        </BackgroundWrapper>
    );
}
