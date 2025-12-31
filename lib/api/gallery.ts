import axios, { AxiosError } from "axios";
import { handleApiError } from "../utils/errorHandler";
import type {
    CreateGalleryRequest,
    UpdateGalleryRequest,
    GalleryItemResponse,
} from "../types/api.types";
import type { GalleryListItem } from "../gallery";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

// Axios 인스턴스 생성 (에러 처리 및 타임아웃 설정)
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30초 타임아웃 (이미지 업로드용)
});

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        const errorInfo = handleApiError(error, "Gallery API");
        (error as AxiosError & { userMessage?: string }).userMessage = errorInfo.message;
        return Promise.reject(error);
    }
);

// 갤러리 목록 조회
export async function getGalleryItems(): Promise<GalleryListItem[]> {
    try {
        const response = await apiClient.get<{ items: GalleryListItem[] }>("/api/gallery");
        return response.data.items || [];
    } catch (error) {
        throw error;
    }
}

// 갤러리 상세 조회
export async function getGalleryItem(id: number): Promise<GalleryItemResponse> {
    try {
        const response = await apiClient.get<GalleryItemResponse>(`/api/gallery/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// 갤러리 생성
export async function createGalleryItem(data: CreateGalleryRequest): Promise<GalleryItemResponse> {
    try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content || "");
        formData.append("category", data.category || "");

        if (data.images && Array.isArray(data.images)) {
            data.images.forEach((image) => {
                if (image instanceof File) {
                    formData.append(`images`, image);
                }
            });
        }

        const response = await apiClient.post<GalleryItemResponse>("/api/gallery", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            timeout: 60000, // 이미지 업로드는 60초 타임아웃
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// 갤러리 수정
export async function updateGalleryItem(id: number, data: UpdateGalleryRequest): Promise<GalleryItemResponse> {
    try {
        const formData = new FormData();
        if (data.title) formData.append("title", data.title);
        if (data.content !== undefined) formData.append("content", data.content || "");
        if (data.category !== undefined) formData.append("category", data.category || "");

        if (data.images && Array.isArray(data.images)) {
            data.images.forEach(image => {
                if (image instanceof File) {
                    formData.append(`images`, image);
                }
            });
        }

        const response = await apiClient.put<GalleryItemResponse>(`/api/gallery/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            timeout: 60000, // 이미지 업로드는 60초 타임아웃
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// 갤러리 삭제
export async function deleteGalleryItem(id: number): Promise<{ success: boolean }> {
    try {
        const response = await apiClient.delete<{ success: boolean }>(`/api/gallery/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


