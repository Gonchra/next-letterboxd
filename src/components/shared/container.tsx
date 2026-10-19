import {HTMLAttributes, ReactNode} from "react";
import {cn} from "@/lib/utils/cn";

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export function Container({children, className, ...props}: Props) {
    return (
        <div className={cn('mx-auto w-full max-w-237.5 lg:max-w-275 px-4 md:px-8', className)} {...props}>
            {children}
        </div>
    )
}