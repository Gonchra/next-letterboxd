'use client'

import {useState} from "react";
import {cn} from "@/lib/utils/cn";
import {Star} from "lucide-react";

interface StarRatingProps {
    value: number
    onChange?: (rating: number) => void
    isReadonly?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export function StarRating({
                               value,
                               onChange,
                               isReadonly = false,
                               size = 'md'
                           }: StarRatingProps) {
    const [hovered, setHovered] = useState<number>(0)

    const sizeClasses = {
        sm: 'size-3.5',
        md: 'size-5',
        lg: 'size-6'
    }

    const isActive = isReadonly ? value : hovered || value

    return (
        <div
            className="flex items-center gap-0.5"
            role={isReadonly ? undefined : 'radiogroup'}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type='button'
                    role={isReadonly ? undefined : 'radio'}
                    aria-checked={isReadonly ? undefined : value === star}
                    aria-label={
                        isReadonly ? undefined : `${star} star${star !== 1 ? 's' : ''}`
                    }
                    disabled={isReadonly}
                    onClick={() => !isReadonly && onChange?.(star)}
                    onMouseEnter={() => !isReadonly && setHovered(star)}
                    onMouseLeave={() => !isReadonly && setHovered(0)}
                    className={
                        cn(
                            'transition-transform',
                            !isReadonly && "cursor-pointer hover:scale-110 focus-visible:outline-none",
                            isReadonly && 'cursor-default'
                        )}
                >
                    <Star
                        className={cn(
                            sizeClasses[size],
                            'transition-colors',
                            star <= isActive ? 'fill-primary text-primary' : 'fill-transparent text-muted-foreground/40'
                        )}
                    />
                </button>
            ))}
        </div>
    )
}