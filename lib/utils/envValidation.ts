/**
 * 환경 변수 검증 유틸리티
 * 프로덕션 배포 시 필수 환경 변수가 설정되어 있는지 확인합니다.
 */

interface EnvValidationResult {
    isValid: boolean;
    missing: string[];
    warnings: string[];
}

/**
 * 서버 사이드 필수 환경 변수 목록
 */
const REQUIRED_SERVER_ENV_VARS = [
    "DIRECT_URL",
    "NEXTAUTH_SECRET",
    "AWS_REGION",
    "AWS_S3_BUCKET_NAME",
    "AWS_CLOUDFRONT_DOMAIN",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
] as const;

/**
 * 프로덕션에서 필수인 환경 변수 목록
 */
const REQUIRED_PRODUCTION_ENV_VARS = [
    "NEXTAUTH_URL",
] as const;

/**
 * 선택적 환경 변수 목록 (경고만 표시)
 */
const OPTIONAL_ENV_VARS = [
    "NEXT_PUBLIC_BASE_URL",
    "NEXT_PUBLIC_KAKAO_KEY",
] as const;

/**
 * 환경 변수 검증
 * @param isProduction 프로덕션 환경 여부
 * @returns 검증 결과
 */
export function validateEnvVars(isProduction = false): EnvValidationResult {
    const missing: string[] = [];
    const warnings: string[] = [];

    // 서버 사이드 필수 환경 변수 확인
    for (const envVar of REQUIRED_SERVER_ENV_VARS) {
        if (!process.env[envVar] || process.env[envVar]?.trim() === "") {
            missing.push(envVar);
        }
    }

    // 프로덕션 필수 환경 변수 확인
    if (isProduction) {
        for (const envVar of REQUIRED_PRODUCTION_ENV_VARS) {
            if (!process.env[envVar] || process.env[envVar]?.trim() === "") {
                missing.push(envVar);
            }
        }
    }

    // 선택적 환경 변수 확인 (경고만)
    for (const envVar of OPTIONAL_ENV_VARS) {
        if (!process.env[envVar] || process.env[envVar]?.trim() === "") {
            warnings.push(envVar);
        }
    }

    return {
        isValid: missing.length === 0,
        missing,
        warnings,
    };
}

/**
 * 환경 변수 검증 및 에러 발생
 * 필수 환경 변수가 없으면 에러를 throw합니다.
 * @param isProduction 프로덕션 환경 여부
 */
export function requireEnvVars(isProduction = false): void {
    const result = validateEnvVars(isProduction);

    if (!result.isValid) {
        const errorMessage = `
환경 변수 검증 실패

누락된 필수 환경 변수:
${result.missing.map(v => `  - ${v}`).join("\n")}

프로덕션 배포 전에 모든 필수 환경 변수를 설정해주세요.
.env.example 파일을 참고하여 설정하세요.
        `.trim();

        throw new Error(errorMessage);
    }

    if (result.warnings.length > 0 && process.env.NODE_ENV !== "test") {
        console.warn(`
환경 변수 경고:

설정되지 않은 선택적 환경 변수:
${result.warnings.map(v => `  - ${v}`).join("\n")}

일부 기능이 제대로 작동하지 않을 수 있습니다.
        `.trim());
    }
}

/**
 * 개발 환경에서만 환경 변수 검증 (경고만)
 */
export function validateEnvVarsInDev(): void {
    if (process.env.NODE_ENV === "development") {
        const result = validateEnvVars(false);
        
        if (result.missing.length > 0) {
            console.warn(`
⚠️  개발 환경 변수 경고:

누락된 환경 변수:
${result.missing.map(v => `  - ${v}`).join("\n")}

일부 기능이 제대로 작동하지 않을 수 있습니다.
.env 파일을 확인해주세요.
            `.trim());
        }

        if (result.warnings.length > 0) {
            console.warn(`
⚠️  선택적 환경 변수 경고:

설정되지 않은 선택적 환경 변수:
${result.warnings.map(v => `  - ${v}`).join("\n")}
            `.trim());
        }
    }
}

