"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema } from "../../../lib/validation";
import ValidatedInput from "../components/common/validated-input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import type { z } from "zod";
import { createPhoneRegister } from "../../../lib/utils/formHelpers";

type InquiryFormData = z.infer<typeof inquirySchema>;

export default function ContactPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<InquiryFormData>({
        resolver: zodResolver(inquirySchema),
    });

    const onSubmit = async (data: InquiryFormData) => {
        // API 호출 로직
        console.log("문의 제출:", data);
        reset();
    };

    return (
        <div className="max-w-6xl mx-auto py-16 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
                    문의하기
                </h1>
                <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                    궁금한 사항이나 문의가 있으시면 언제든지 연락해주세요.
                    빠르게 답변드리겠습니다.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <Card className="shadow-lg border-stone-200 bg-white">
                    <CardContent className="p-6 text-center">
                        <Phone className="h-8 w-8 text-stone-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-stone-900 mb-2">
                            전화
                        </h3>
                        <p className="text-stone-600">010-0000-0000</p>
                    </CardContent>
                </Card>
                <Card className="shadow-lg border-stone-200 bg-white">
                    <CardContent className="p-6 text-center">
                        <Mail className="h-8 w-8 text-stone-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-stone-900 mb-2">
                            이메일
                        </h3>
                        <p className="text-stone-600">contact@example.com</p>
                    </CardContent>
                </Card>
                <Card className="shadow-lg border-stone-200 bg-white">
                    <CardContent className="p-6 text-center">
                        <MapPin className="h-8 w-8 text-stone-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-stone-900 mb-2">
                            주소
                        </h3>
                        <p className="text-stone-600">
                            서울특별시 강남구 테헤란로 123
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-xl border-stone-200 bg-white">
                <CardHeader>
                    <CardTitle className="text-2xl">문의 양식</CardTitle>
                    <CardDescription>
                        아래 양식을 작성해주시면 빠르게 답변드리겠습니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <ValidatedInput
                            label="성함"
                            type="text"
                            registerReturn={register("name")}
                            error={errors.name}
                            placeholder="성함을 입력해주세요"
                        />
                        <ValidatedInput
                            label="연락처"
                            type="tel"
                            registerReturn={createPhoneRegister(
                                register("phone"),
                                setValue,
                                "phone"
                            )}
                            error={errors.phone}
                            placeholder="010-1234-1234"
                        />
                        <ValidatedInput
                            label="이메일"
                            type="email"
                            registerReturn={register("email")}
                            error={errors.email}
                            placeholder="이메일을 입력해주세요"
                        />
                        <ValidatedInput
                            label="문의 내용"
                            type="textarea"
                            registerReturn={register("message")}
                            error={errors.message}
                            placeholder="문의 내용을 입력해주세요"
                            helperText="최대한 자세히 작성해주세요"
                            rows={5}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 text-base"
                        >
                            {isSubmitting ? "전송 중..." : "문의하기"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
