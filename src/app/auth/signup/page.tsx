"use client";

import ValidatedInput from "@/app/components/common/validated-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../../../../lib/validation";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import type { z } from "zod";
import { createPhoneRegister } from "../../../../lib/utils/formHelpers";
import { removePhoneFormatting, isValidPhoneNumber } from "../../../../lib/utils/phone";
import { useEffect, useRef, useState, useCallback } from "react";

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        setError,
        clearErrors,
        watch,
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        mode: "onBlur",
    });

    // 모든 필드 값 watch
    const email = watch("email");
    const password = watch("password");
    const passwordConfirm = watch("passwordConfirm");
    const name = watch("name");
    const nickname = watch("nickname");
    const phone = watch("phone");

    const [isCheckingNickname, setIsCheckingNickname] = useState(false);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState<
        boolean | null
    >(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const lastCheckedNicknameRef = useRef<string | null>(null);

    // 각 필드의 유효성 상태 계산 (에러가 없고 값이 입력되었을 때)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid =
        !errors.email &&
        !!email &&
        email.trim().length > 0 &&
        emailRegex.test(email.trim());
    const isPasswordValid =
        !errors.password &&
        !!password &&
        password.length >= 8 &&
        /[A-Za-z]/.test(password) &&
        /\d/.test(password);
    const isPasswordConfirmValid =
        !errors.passwordConfirm &&
        !!passwordConfirm &&
        passwordConfirm.length > 0 &&
        password === passwordConfirm;
    const isNameValid = !errors.name && !!name && name.trim().length > 0;
    const isNicknameValid =
        !errors.nickname &&
        !!nickname &&
        nickname.trim().length >= 2 &&
        nickname.trim().length <= 20;
    const isPhoneValid =
        !errors.phone &&
        !!phone &&
        phone.trim().length > 0 &&
        isValidPhoneNumber(removePhoneFormatting(phone));

    // 닉네임 중복 체크 함수
    const checkNicknameAvailability = useCallback(
        async (nicknameValue: string) => {
            const trimmedNickname = nicknameValue.trim();

            // 빈 값이거나 최소 길이 미만이면 상태 초기화
            if (!trimmedNickname || trimmedNickname.length < 2) {
                setIsNicknameAvailable(null);
                clearErrors("nickname");
                lastCheckedNicknameRef.current = null;
                return;
            }

            // 최대 길이 초과 시 체크하지 않음
            if (trimmedNickname.length > 20) {
                setIsNicknameAvailable(null);
                clearErrors("nickname");
                lastCheckedNicknameRef.current = null;
                return;
            }

            // 동일한 닉네임이면 재검사하지 않음
            if (lastCheckedNicknameRef.current === trimmedNickname) {
                return;
            }

            // 이전 요청 취소
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // 새로운 AbortController 생성
            const abortController = new AbortController();
            abortControllerRef.current = abortController;

            setIsCheckingNickname(true);
            setIsNicknameAvailable(null);
            clearErrors("nickname");

            try {
                const res = await fetch("/api/auth/check-nickname", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nickname: trimmedNickname }),
                    signal: abortController.signal,
                });

                // 요청이 취소된 경우 처리하지 않음
                if (abortController.signal.aborted) {
                    return;
                }

                if (!res.ok) {
                    // 네트워크 에러가 아닌 경우
                    if (res.status >= 500) {
                        throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                    }
                    throw new Error("닉네임 중복 체크 실패");
                }

                const data = (await res.json()) as { available: boolean };
                
                // 요청이 취소된 경우 처리하지 않음
                if (abortController.signal.aborted) {
                    return;
                }

                if (!data.available) {
                    setError("nickname", {
                        type: "manual",
                        message: "이미 사용 중인 닉네임입니다.",
                    });
                    setIsNicknameAvailable(false);
                } else {
                    clearErrors("nickname");
                    setIsNicknameAvailable(true);
                }

                // 성공적으로 체크한 닉네임 저장
                lastCheckedNicknameRef.current = trimmedNickname;
            } catch (error) {
                // AbortError는 무시 (요청 취소는 정상 동작)
                if (error instanceof Error && error.name === "AbortError") {
                    return;
                }

                // 네트워크 에러 처리
                if (error instanceof TypeError && error.message.includes("fetch")) {
                    setError("nickname", {
                        type: "manual",
                        message: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",
                    });
                } else {
                    console.error("닉네임 중복 체크 오류:", error);
                }
                setIsNicknameAvailable(null);
                lastCheckedNicknameRef.current = null;
            } finally {
                // 현재 요청이 취소되지 않았을 때만 로딩 상태 해제
                if (!abortController.signal.aborted) {
                    setIsCheckingNickname(false);
                }
            }
        },
        [setError, clearErrors]
    );

    // 닉네임 변경 시 debounce하여 중복 체크
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        const trimmedNickname = nickname?.trim() || "";

        if (trimmedNickname.length >= 2 && trimmedNickname.length <= 20) {
            debounceTimerRef.current = setTimeout(() => {
                checkNicknameAvailability(trimmedNickname);
            }, 500); // 500ms debounce
        } else {
            // 닉네임이 2글자 미만이거나 20자 초과면 상태 초기화
            setIsNicknameAvailable(null);
            clearErrors("nickname");
            lastCheckedNicknameRef.current = null;
            
            // 진행 중인 요청 취소
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            setIsCheckingNickname(false);
        }

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [nickname, checkNicknameAvailability, clearErrors]);

    // 컴포넌트 언마운트 시 요청 취소
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const onSubmit = async (data: SignUpFormData) => {
        // 닉네임이 있는 경우 제출 전 최종 중복 체크
        if (data.nickname && data.nickname.trim().length >= 2) {
            const trimmedNickname = data.nickname.trim();
            
            // 마지막으로 체크한 닉네임과 다르거나, 아직 체크하지 않은 경우
            if (lastCheckedNicknameRef.current !== trimmedNickname) {
                try {
                    setIsCheckingNickname(true);
                    const res = await fetch("/api/auth/check-nickname", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ nickname: trimmedNickname }),
                    });

                    if (!res.ok) {
                        throw new Error("닉네임 중복 체크 실패");
                    }

                    const checkData = (await res.json()) as { available: boolean };
                    if (!checkData.available) {
                        setError("nickname", {
                            type: "manual",
                            message: "이미 사용 중인 닉네임입니다.",
                        });
                        setIsNicknameAvailable(false);
                        toast.error("회원가입 실패", {
                            description: "이미 사용 중인 닉네임입니다.",
                        });
                        setIsCheckingNickname(false);
                        return;
                    }
                    
                    setIsNicknameAvailable(true);
                    lastCheckedNicknameRef.current = trimmedNickname;
                } catch (error) {
                    console.error("최종 닉네임 중복 체크 오류:", error);
                    toast.error("회원가입 실패", {
                        description: "닉네임 확인 중 오류가 발생했습니다.",
                    });
                    setIsCheckingNickname(false);
                    return;
                } finally {
                    setIsCheckingNickname(false);
                }
            }
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = (await res.json()) as { message?: string };
                const errorMessage =
                    errorData.message || "회원가입에 실패했습니다.";

                // 특정 에러 메시지에 따라 필드에 에러 설정
                if (errorMessage.includes("이메일")) {
                    setError("email", {
                        type: "manual",
                        message: errorMessage,
                    });
                } else if (errorMessage.includes("닉네임")) {
                    setError("nickname", {
                        type: "manual",
                        message: errorMessage,
                    });
                    setIsNicknameAvailable(false);
                    lastCheckedNicknameRef.current = null;
                }

                toast.error("회원가입 실패", {
                    description: errorMessage,
                });
                return;
            }

            toast.success("회원가입 완료", {
                description: "회원가입이 성공적으로 완료되었습니다.",
            });
            router.push("/auth/login");
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "회원가입 중 오류가 발생했습니다.";
            toast.error("회원가입 실패", {
                description: errorMessage,
            });
        }
    };

    return (
        <div className="flex items-center justify-center px-4 pt-16 pb-12 bg-gradient-to-br from-stone-50 via-white to-stone-50">
            <Card className="w-full max-w-lg shadow-xl border-stone-200 bg-white">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold text-stone-900">
                        회원가입
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                        Portfolio Project 회원이 되어 다양한 서비스를
                        이용해보세요
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                        noValidate
                    >
                        <ValidatedInput
                            label="이메일"
                            type="email"
                            placeholder="이메일을 입력하세요"
                            error={errors.email}
                            isValid={isEmailValid}
                            registerReturn={register("email")}
                        />
                        <ValidatedInput
                            label="비밀번호"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            error={errors.password}
                            isValid={isPasswordValid}
                            registerReturn={register("password")}
                            helperText="영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요."
                        />
                        <ValidatedInput
                            label="비밀번호 확인"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            error={errors.passwordConfirm}
                            isValid={isPasswordConfirmValid}
                            registerReturn={register("passwordConfirm")}
                        />
                        <ValidatedInput
                            label="이름"
                            type="text"
                            placeholder="이름을 입력하세요"
                            error={errors.name}
                            isValid={isNameValid}
                            registerReturn={register("name")}
                        />
                        <ValidatedInput
                            label="닉네임"
                            type="text"
                            placeholder="닉네임을 입력하세요"
                            error={errors.nickname}
                            successMessage={
                                isNicknameAvailable === true && !isCheckingNickname
                                    ? "사용 가능한 닉네임입니다."
                                    : undefined
                            }
                            isValid={
                                isNicknameValid &&
                                isNicknameAvailable === null &&
                                !isCheckingNickname
                            }
                            registerReturn={register("nickname")}
                            helperText={
                                isCheckingNickname
                                    ? "닉네임 중복 확인 중..."
                                    : isNicknameAvailable === null
                                    ? "2~20자 영문, 숫자, 한글 가능"
                                    : undefined
                            }
                        />
                        <ValidatedInput
                            label="휴대폰 번호"
                            type="tel"
                            placeholder="010-1234-1234"
                            error={errors.phone}
                            isValid={isPhoneValid}
                            registerReturn={createPhoneRegister(
                                register("phone"),
                                setValue,
                                "phone"
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 text-base mt-6"
                        >
                            {isSubmitting ? "가입 중..." : "회원가입하기"}
                        </Button>
                        <div className="text-center text-sm text-stone-600">
                            이미 계정이 있으신가요?{" "}
                            <Link
                                href="/auth/login"
                                className="text-stone-900 font-semibold hover:underline"
                            >
                                로그인
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
