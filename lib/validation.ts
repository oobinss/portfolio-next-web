import { z } from "zod";

export const signUpSchema = z
    .object({
        email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
        password: z
            .string()
            .min(8, "비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.")
            .max(32, "비밀번호는 32자 이하여야 합니다.")
            .regex(/[A-Za-z]/, "영문자를 포함해야 합니다.")
            .regex(/\d/, "숫자를 포함해야 합니다."),
        passwordConfirm: z
            .string()
            .min(1, "확인을 위해 비밀번호를 한 번 더 입력해주세요.")
            .max(32, "비밀번호는 32자 이하여야 합니다."),
        name: z
            .string()
            .min(1, "이름을 입력해주세요.")
            .max(10, "이름은 10자 이하여야 합니다."),
        phone: z
            .string()
            .regex(/^[0-9]{9,15}$/, "휴대폰번호를 올바르게 입력해주세요.")
            .optional(),
        nickname: z
            .string()
            .min(2, { message: "닉네임은 최소 2글자입니다." })
            .max(20, { message: "닉네임은 최대 20글자입니다." })
            .optional(),
    })
    .refine(data => data.password === data.passwordConfirm, {
        message: "비밀번호 확인이 일치하지 않습니다.",
        path: ["passwordConfirm"],
    });

export const loginSchema = z.object({
    email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

export const boardPostSchema = z
    .object({
        title: z.string().min(1, "제목을 입력해주세요."),
        content: z.string().min(1, "글 내용을 입력해주세요."),
        isSecret: z.boolean().optional(),
        password: z.string().optional().nullable(),
    })
    .superRefine((data, ctx) => {
        // 비밀글로 설정하는 경우에만 비밀번호 필수
        // 기존 비밀글을 수정하는 경우는 비밀번호가 없어도 됨 (작성자/관리자는 이미 인증됨)
        if (data.isSecret && data.password !== null && data.password !== undefined && data.password.trim().length > 0) {
            if (data.password.trim().length < 6) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["password"],
                    message:
                        "비밀번호는 최소 6자 이상이어야 합니다.",
                });
            }
        }
    });

export const commentSchema = z.object({
    postId: z.number(),
    content: z.string().min(1, "댓글 내용을 입력해주세요."),
});

export const inquirySchema = z.object({
    name: z
        .string()
        .min(1, "성함을 입력해주세요.")
        .max(20, "성함은 20자 이하로 입력해주세요."),
    phone: z
        .string()
        .regex(/^[0-9]{9,15}$/, "휴대폰번호를 올바르게 입력해주세요."),
    email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
    message: z
        .string()
        .min(1, "문의 내용을 입력해주세요.")
        .max(1000, "문의 내용은 1000자 이하로 입력해주세요."),
});

