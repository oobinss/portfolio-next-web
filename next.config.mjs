/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: {
        buildActivity: false,
        appIsrStatus: false,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "your-s3-bucket.s3.ap-northeast-2.amazonaws.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "d1q4gi1n2yisdn.cloudfront.net",
                pathname: "/**",
            },
        ],
        // 이미지 최적화 설정 - AVIF 우선, WebP 폴백
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000, // 1년 캐싱으로 성능 향상
        // 이미지 최적화 품질 설정
        dangerouslyAllowSVG: true,
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
    },
    // 압축 활성화
    compress: true,
    // 프로덕션 최적화
    poweredByHeader: false,
    // 실험적 기능 (성능 향상)
    experimental: {
        optimizePackageImports: ["lucide-react", "@tanstack/react-query"],
    },
    // 프로덕션 빌드 최적화
    productionBrowserSourceMaps: false,
    // 컴파일러 최적화
    compiler: {
        removeConsole:
            process.env.NODE_ENV === "production"
                ? {
                      exclude: ["error", "warn"],
                  }
                : false,
    },
};

export default nextConfig;
