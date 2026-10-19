import type {ReactNode} from "react";
import Link from "next/link";

interface Props {
    title: string
    href?: string
    rightLabel?: string
    children?: ReactNode
}

export function SectionHeader({title, href, rightLabel, children}: Props) {
    return (
        <div className="flex items-center justify-between border-b border-border mb-3 pb-2">
            <h2 className="text-xs uppercase tracking-[0.12em] text-muted font-normal">
                {title}
            </h2>

            <div className="flex items-center gap-5">
                {children}

                {href && !children && (
                    <Link
                        href={href}
                        className="text-[11px] uppercase tracking-widest text-muted font-normal hover:text-white cursor-pointer transition-colors"
                    >
                        {rightLabel || 'Все'}
                    </Link>
                )}
            </div>
        </div>
    )
}