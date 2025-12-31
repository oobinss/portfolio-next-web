import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface ValidatedInputProps {
    label: string;
    type?: "text" | "email" | "password" | "textarea" | "tel";
    error?: FieldError | string;
    helperText?: string;
    registerReturn?: UseFormRegisterReturn;
    placeholder?: string;
    rows?: number;
}

export default function ValidatedInput({
    label,
    type = "text",
    error,
    helperText = "",
    registerReturn,
    placeholder = "",
    rows,
}: ValidatedInputProps) {
    const errorMessage = typeof error === "string" ? error : error?.message;
    
    return (
        <div className="mb-5">
            <label
                className={`block mb-3 text-[16px] leading-[20px] font-bold tracking-[-0.3px] ${
                    errorMessage ? "text-[rgb(255,119,119)]" : "text-[#2F3438]"
                }`}
            >
                {label}
            </label>
            {helperText && (
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
                        className={`w-full p-2 rounded outline-none transition border ${
                            errorMessage
                                ? "border-[#ff7777] ring-1 ring-[#ff7777] shadow-[0_0_0_3px_rgba(255,119,119,0.3)]"
                                : "border-gray-300"
                        }`}
                    />
                ) : (
                    <input
                        type={type}
                        placeholder={placeholder}
                        {...registerReturn}
                        className={`w-full p-2 rounded outline-none transition border ${
                            errorMessage
                                ? "border-[#ff7777] ring-1 ring-[#ff7777] shadow-[0_0_0_3px_rgba(255,119,119,0.3)]"
                                : "border-gray-300"
                        }`}
                    />
                )}
            </div>

            {errorMessage && (
                <div className="pt-2.5 text-[14px] leading-[18px] text-[#ff7777]">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}


