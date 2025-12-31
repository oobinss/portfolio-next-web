import { AxiosError } from "axios";

interface ErrorResponse {
    error?: string;
    message?: string;
}

interface ErrorInfo {
    title: string;
    message: string;
}

/**
 * API 에러를 사용자 친화적인 메시지로 변환
 */
export function getErrorMessage(error: unknown): ErrorInfo {
    const axiosError = error as AxiosError<ErrorResponse>;

    // 네트워크 에러
    if (!axiosError.response) {
        if (axiosError.code === "ECONNABORTED" || axiosError.message?.includes("timeout")) {
            return {
                title: "요청 시간 초과",
                message: "서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.",
            };
        }
        if (axiosError.message?.includes("Network Error")) {
            return {
                title: "네트워크 오류",
                message: "인터넷 연결을 확인하고 다시 시도해주세요.",
            };
        }
        return {
            title: "연결 오류",
            message: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
        };
    }

    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    switch (status) {
        case 400:
            return {
                title: "잘못된 요청",
                message: data?.error || data?.message || "입력값을 확인해주세요.",
            };
        case 401:
            // 응답 데이터에 error 메시지가 있으면 그것을 사용 (비밀번호 오류 등)
            if (data?.error && !data.error.includes("로그인")) {
                return {
                    title: "인증 실패",
                    message: data.error,
                };
            }
            return {
                title: "인증 필요",
                message: "로그인이 필요합니다. 로그인 페이지로 이동합니다.",
            };
        case 403:
            return {
                title: "권한 없음",
                message: data?.error || data?.message || "이 작업을 수행할 권한이 없습니다.",
            };
        case 404:
            return {
                title: "찾을 수 없음",
                message: data?.error || data?.message || "요청한 리소스를 찾을 수 없습니다.",
            };
        case 409:
            return {
                title: "충돌",
                message: data?.message || "이미 존재하는 데이터입니다.",
            };
        case 500:
            return {
                title: "서버 오류",
                message: "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            };
        default:
            return {
                title: "오류 발생",
                message: data?.error || data?.message || "알 수 없는 오류가 발생했습니다.",
            };
    }
}

/**
 * 에러를 로깅하고 사용자 친화적인 메시지 반환
 */
export function handleApiError(error: unknown, context = ""): ErrorInfo {
    const errorInfo = getErrorMessage(error);
    const axiosError = error as AxiosError<ErrorResponse>;
    
    // 개발 환경에서만 상세 로그 출력
    // 단, 비밀번호 확인 API의 400 에러는 정상적인 사용자 입력 검증 오류이므로 로그하지 않음
    if (process.env.NODE_ENV === "development") {
        const status = axiosError.response?.status;
        const url = axiosError.config?.url || "";
        
        // 비밀번호 확인 API의 400 에러는 로그하지 않음
        const isPasswordVerificationError = status === 400 && url.includes("/verifyPassword");
        
        if (!isPasswordVerificationError) {
            console.error(`[${context}] API Error:`, {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                message: axiosError.message,
            });
        }
    }

    return errorInfo;
}

