import { PrismaClient } from "../src/generated/prisma";
import { validateEnvVarsInDev } from "./utils/envValidation";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            process.env.NODE_ENV === "development"
                ? process.env.PRISMA_LOG_QUERIES === "true"
                    ? ["query", "error", "warn"]
                    : ["error", "warn"]
                : ["error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// 개발 환경에서 환경 변수 검증 (경고만)
validateEnvVarsInDev();

export default prisma;
