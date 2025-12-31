import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "default",
            size = "default",
            ...props
        },
        ref
    ) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-stone-900 text-stone-50 hover:bg-stone-900/90":
                            variant === "default",
                        "bg-stone-100 text-stone-900 hover:bg-stone-100/80":
                            variant === "secondary",
                        "bg-white text-stone-900 border border-stone-200 hover:bg-stone-50":
                            variant === "outline",
                        "bg-transparent text-stone-900 hover:bg-stone-100":
                            variant === "ghost",
                        "bg-red-600 text-white hover:bg-red-700":
                            variant === "destructive",
                        "h-10 px-4 py-2": size === "default",
                        "h-9 rounded-md px-3": size === "sm",
                        "h-11 rounded-md px-8": size === "lg",
                        "h-9 rounded-md px-2": size === "icon",
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };


