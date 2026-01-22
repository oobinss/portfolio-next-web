import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password_hash) return null;

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password_hash
                );

                if (!isValid) return null;

                return {
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                } as {
                    id: string;
                    name: string | null;
                    email: string | null;
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 4 * 60 * 60,
    },
    useSecureCookies: process.env.NODE_ENV === "production",
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = Number(user.id);
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as number;
            }

            if (session.user?.email === "owen@admin.com") {
                session.user.role = "admin";
            } else {
                session.user.role =
                    (token.role as "admin" | "user" | undefined) || "user";
            }

            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
