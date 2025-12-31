import axios, { AxiosError } from "axios";
import { handleApiError } from "../utils/errorHandler";
import type {
    CreatePostRequest,
    UpdatePostRequest,
    CreateCommentRequest,
    UpdateCommentRequest,
    VerifyPasswordRequest,
    PostsResponse,
    PostResponse,
    CommentResponse,
    VerifyPasswordResponse,
    PaginationParams,
} from "../types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

// Axios 인스턴스 생성 (에러 처리 및 타임아웃 설정)
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10초 타임아웃
    headers: {
        "Content-Type": "application/json",
    },
});

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        const errorInfo = handleApiError(error, "API");
        // 에러 객체에 사용자 친화적인 메시지 추가
        (error as AxiosError & { userMessage?: string }).userMessage = errorInfo.message;
        return Promise.reject(error);
    }
);

// 게시글 목록 조회
export async function getPosts({ search = "", page = 1, perPage = 10 }: PaginationParams = {}): Promise<PostsResponse> {
    try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("page", page.toString());
        params.append("perPage", perPage.toString());

        const response = await apiClient.get<{ posts: PostsResponse["posts"]; totalCount: number }>(`/api/board/posts?${params}`);
        return {
            posts: response.data.posts || [],
            totalCount: response.data.totalCount || 0,
        };
    } catch (error) {
        throw error;
    }
}

// 게시글 상세 조회 (서버 액션 사용)
export async function getPost(id: number): Promise<PostResponse> {
    try {
        // 서버 컴포넌트에서 직접 사용하므로 API 라우트 대신 서버 액션 사용 권장
        // 클라이언트에서만 사용하는 경우를 위해 API 라우트 호출
        const response = await apiClient.get<PostResponse>(`/api/board/posts/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// 게시글 생성
export async function createPost(data: CreatePostRequest): Promise<PostResponse> {
    try {
        const response = await apiClient.post<PostResponse>("/api/board", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// 게시글 수정
export async function updatePost(id: number, data: UpdatePostRequest): Promise<PostResponse> {
    try {
        const response = await apiClient.put<PostResponse>(`/api/board/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// 게시글 삭제
export async function deletePost(id: number): Promise<{ success: boolean }> {
    try {
        const response = await apiClient.delete<{ success: boolean }>(`/api/board/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// 비밀글 비밀번호 확인
export async function verifyPostPassword(postId: number, password: string): Promise<VerifyPasswordResponse> {
    try {
        const response = await apiClient.post<VerifyPasswordResponse>(
            `/api/board/posts/${postId}/verifyPassword`,
            { password } as VerifyPasswordRequest
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

// 댓글 생성
export async function createComment(postId: number, data: CreateCommentRequest): Promise<CommentResponse> {
    try {
        const response = await apiClient.post<CommentResponse>("/api/board/comments", {
            postId,
            ...data,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// 댓글 수정
export async function updateComment(commentId: number, data: UpdateCommentRequest): Promise<CommentResponse> {
    try {
        const response = await apiClient.put<CommentResponse>(
            `/api/board/comments/${commentId}`,
            data
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

// 댓글 삭제
export async function deleteComment(commentId: number): Promise<{ success: boolean }> {
    try {
        const response = await apiClient.delete<{ success: boolean }>(
            `/api/board/comments/${commentId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}


