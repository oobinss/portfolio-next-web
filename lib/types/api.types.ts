import { Board, Comment, Gallery, User } from "../../src/generated/prisma";

// Prisma 타입 확장 (관계 포함)
export type BoardWithAuthor = Board & {
    author: User;
};

export type BoardWithAuthorAndComments = BoardWithAuthor & {
    comments: CommentWithAuthor[];
};

export type CommentWithAuthor = Comment & {
    author: User;
    replies?: CommentWithAuthor[];
};

export type GalleryItem = Gallery;

// API 요청 타입
export interface CreatePostRequest {
    title: string;
    content: string;
    password?: string;
    isSecret?: boolean;
}

export interface UpdatePostRequest {
    title?: string;
    content?: string;
    password?: string;
    isSecret?: boolean;
}

export interface CreateCommentRequest {
    content: string;
    parentId?: number;
}

export interface UpdateCommentRequest {
    content: string;
}

export interface CreateGalleryRequest {
    title: string;
    content?: string;
    category?: string;
    images: File[];
}

export interface UpdateGalleryRequest {
    title?: string;
    content?: string;
    category?: string;
    images?: File[];
}

export interface VerifyPasswordRequest {
    password: string;
}

// API 응답 타입
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    issues?: Array<{
        path: string;
        message: string;
    }>;
}

export interface PostsResponse {
    posts: BoardWithAuthor[];
    totalCount: number;
}

export interface PostResponse {
    post: BoardWithAuthorAndComments;
}

export interface CommentResponse {
    comment: CommentWithAuthor;
}

export interface GalleryItemsResponse {
    items: GalleryItem[];
}

export interface GalleryItemResponse {
    item: GalleryItem;
}

export interface VerifyPasswordResponse {
    isValid: boolean;
}

// Pagination 타입
export interface PaginationParams {
    page?: number;
    perPage?: number;
    search?: string;
}


