"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// QueryClient 설정 개선
const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                // 데이터가 fresh한 상태로 간주되는 시간 (5분)
                staleTime: 1000 * 60 * 5,
                // 캐시 유지 시간 (10분)
                gcTime: 1000 * 60 * 10,
                // 자동 리페치 비활성화 (필요시 수동으로)
                refetchOnWindowFocus: false,
                // 네트워크 재연결 시 리페치
                refetchOnReconnect: true,
                // 에러 재시도 횟수
                retry: 1,
                // 에러 재시도 지연 시간
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            },
            mutations: {
                // Mutation 실패 시 재시도
                retry: 1,
            },
        },
    });

interface ReactQueryProviderProps {
    children: ReactNode;
}

export default function ReactQueryProvider({ children }: ReactQueryProviderProps) {
    const [queryClient] = useState(() => createQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}


