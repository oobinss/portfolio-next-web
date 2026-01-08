/**
 * React Hook Form 관련 헬퍼 함수
 */

import type {
    UseFormRegisterReturn,
    UseFormSetValue,
    FieldPath,
} from "react-hook-form";

/**
 * 전화번호 입력 필드를 위한 register 반환값 생성
 * onBlur 시 하이픈을 자동으로 제거합니다.
 *
 * @param registerReturn register 함수의 반환값
 * @param setValue setValue 함수
 * @param fieldName 필드 이름
 * @returns 하이픈 제거 로직이 포함된 register 반환값
 */
export function createPhoneRegister<TFieldValues extends Record<string, any>>(
    registerReturn: UseFormRegisterReturn,
    setValue: UseFormSetValue<TFieldValues>,
    fieldName: FieldPath<TFieldValues>
): UseFormRegisterReturn {
    return {
        ...registerReturn,
        onBlur: async e => {
            // 기존 onBlur 먼저 실행
            if (registerReturn.onBlur) {
                await registerReturn.onBlur(e);
            }
            // 입력이 끝났을 때 하이픈 및 모든 비숫자 문자 제거
            const numbersOnly = e.target.value.replace(/[^0-9]/g, "");
            setValue(fieldName, numbersOnly as any, {
                shouldValidate: true,
            });
        },
    };
}
