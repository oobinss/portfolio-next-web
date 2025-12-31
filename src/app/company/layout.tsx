import BackgroundWrapper from "../components/common/backgroundWrapper";
import Image from "next/image";
import type { ReactNode } from "react";

interface CompanyLayoutProps {
    children: ReactNode;
}

export default function CompanyLayout({ children }: CompanyLayoutProps) {
    return (
        <BackgroundWrapper>
            <div className="relative w-full h-[450px] bg-black flex items-center justify-center overflow-hidden">
                <Image
                    src="/main-image.jpg"
                    alt="Portfolio Project 소개 배너 이미지"
                    width={1200}
                    height={400}
                    priority
                    quality={75}
                    sizes="100vw"
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
            </div>
            <main className="max-w-5xl mx-auto py-14 px-6 flex flex-col gap-10">
                {children}
            </main>
        </BackgroundWrapper>
    );
}


