import BackgroundWrapper from "../../components/common/backgroundWrapper";
import Image from "next/image";
import type { ReactNode } from "react";

interface LoginLayoutProps {
    children: ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
    return (
        <BackgroundWrapper>
            <div className="relative w-full h-[450px] bg-black flex items-center justify-center overflow-hidden">
                <Image
                    src="/main-image.jpg"
                    alt="로그인 상세 배너"
                    width={1200}
                    height={400}
                    priority
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
            </div>
            <main className="max-w-md mx-auto">{children}</main>
        </BackgroundWrapper>
    );
}
