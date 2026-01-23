import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface ValidatedInputProps {
    label: string;
    type?: "text" | "email" | "password" | "textarea" | "tel";
    error?: FieldError | string;
    successMessage?: string;
    isValid?: boolean; // 에러가 없고 값이 입력되었을 때 true
    helperText?: string;
    registerReturn?: UseFormRegisterReturn;
    placeholder?: string;
    rows?: number;
}

export default function ValidatedInput({
    label,
    type = "text",
    error,
    successMessage,
    isValid = false,
    helperText = "",
    registerReturn,
    placeholder = "",
    rows,
}: ValidatedInputProps) {
    const errorMessage = typeof error === "string" ? error : error?.message;
    const hasError = !!errorMessage;
    const hasSuccessMessage = !!successMessage && !hasError;
    const hasSuccessState = isValid && !hasError && !hasSuccessMessage;
    
    return (
        <div className="mb-5">
            <label
                className={`block mb-3 text-[16px] leading-[20px] font-bold tracking-[-0.3px] ${
                    hasError
                        ? "text-[rgb(255,119,119)]"
                        : hasSuccessMessage || hasSuccessState
                        ? "text-[#22c55e]"
                        : "text-[#2F3438]"
                }`}
            >
                {label}
            </label>
            {helperText && !hasError && !hasSuccessMessage && (
                <div className="mb-2.5 text-[14px] leading-[18px] text-[#828C94] tracking-[-0.3px]">
                    {helperText}
                </div>
            )}
            <div className="relative">
                {type === "textarea" ? (
                    <textarea
                        placeholder={placeholder}
                        rows={rows || 5}
                        {...registerReturn}
                        className={`w-full p-2 rounded transition-all duration-200 border ring-offset-2 ${
                            hasError
                                ? "border-[#ff7777] focus-visible:outline-none focus-visible:border-[#ff7777] focus-visible:ring-2 focus-visible:ring-[#ff7777] focus-visible:ring-opacity-40"
                                : hasSuccessMessage || hasSuccessState
                                ? "border-[#22c55e] focus-visible:outline-none focus-visible:border-[#22c55e] focus-visible:ring-2 focus-visible:ring-[#22c55e] focus-visible:ring-opacity-40"
                                : "border-gray-300 focus-visible:outline-none focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-opacity-40"
                        }`}
                    />
                ) : (
                    <input
                        type={type}
                        placeholder={placeholder}
                        {...registerReturn}
                        className={`w-full p-2 rounded transition-all duration-200 border ring-offset-2 ${
                            hasError
                                ? "border-[#ff7777] focus-visible:outline-none focus-visible:border-[#ff7777] focus-visible:ring-2 focus-visible:ring-[#ff7777] focus-visible:ring-opacity-40"
                                : hasSuccessMessage || hasSuccessState
                                ? "border-[#22c55e] focus-visible:outline-none focus-visible:border-[#22c55e] focus-visible:ring-2 focus-visible:ring-[#22c55e] focus-visible:ring-opacity-40"
                                : "border-gray-300 focus-visible:outline-none focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-opacity-40"
                        }`}
                    />
                )}
            </div>

            {errorMessage && (
                <div
                    className="pt-2.5 text-[14px] leading-[18px] text-[#ff7777]"
                    role="alert"
                    aria-live="polite"
                >
                    {errorMessage}
                </div>
            )}
            {hasSuccessMessage && (
                <div
                    className="pt-2.5 text-[14px] leading-[18px] text-[#22c55e]"
                    role="status"
                    aria-live="polite"
                >
                    {successMessage}
                </div>
            )}
        </div>
    );
}


