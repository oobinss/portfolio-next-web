/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "error-red": "#f77",
            },
            fontFamily: {
                pretendard: [
                    "Pretendard Variable",
                    "Pretendard",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "system-ui",
                    "Roboto",
                    "Helvetica Neue",
                    "Segoe UI",
                    "Apple SD Gothic Neo",
                    "Noto Sans KR",
                    "Malgun Gothic",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol",
                    "sans-serif",
                ],
            },
            boxShadow: {
                "error-glow": "0 0 0 3px rgba(255,119,119,0.3)",
            },
            animation: {
                "fade-in": "fadeIn 0.2s ease-in-out",
                "slide-up": "slideUp 0.3s ease-out",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(-10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};
