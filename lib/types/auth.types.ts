import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            role?: "admin" | "user";
        } & DefaultSession["user"];
    }

    interface User {
        id: string; // NextAuth의 기본 User 타입은 id가 string이어야 함
        role?: "admin" | "user";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number; // JWT에서는 number로 저장
        role?: "admin" | "user";
    }
}

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
    nickname?: string;
    phone?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

