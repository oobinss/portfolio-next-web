import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2",
                {
                    "border-transparent bg-stone-900 text-stone-50 hover:bg-stone-900/80":
                        variant === "default",
                    "border-transparent bg-stone-100 text-stone-900 hover:bg-stone-100/80":
                        variant === "secondary",
                    "border-transparent bg-stone-50 text-stone-900 hover:bg-stone-50/80":
                        variant === "outline",
                },
                className
            )}
            {...props}
        />
    );
}

export { Badge };


