/**
 * 전화번호 관련 유틸리티 함수
 */

/**
 * 전화번호에서 하이픈 및 모든 비숫자 문자를 제거하고 숫자만 반환
 * @param phone 전화번호 문자열
 * @returns 숫자만 포함된 전화번호 문자열
 */
export function removePhoneFormatting(
    phone: string | undefined | null
): string {
    if (!phone) return "";
    return phone.replace(/[^0-9]/g, "");
}

/**
 * 전화번호가 유효한 형식인지 검증 (9-15자리 숫자)
 * @param phone 전화번호 문자열 (숫자만)
 * @returns 유효성 여부
 */
export function isValidPhoneNumber(phone: string): boolean {
    return /^[0-9]{9,15}$/.test(phone);
}









