"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
    return (
        <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
                style: {
                    background: "white",
                    border: "1px solid rgb(231, 229, 228)",
                    color: "rgb(28, 25, 23)",
                },
                className: "font-pretendard",
            }}
        />
    );
}


