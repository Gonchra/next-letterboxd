'use client'

import {UserDiaryItem} from "@/server/types/diary";
import Image from "next/image";
import Link from "next/link";
import {StarRating} from "@/components/shared/star-rating";
import {HeartIcon, MessageSquareIcon} from "lucide-react";

interface DiaryItemProps {
    item: UserDiaryItem
}

export function DiaryItem({item}: DiaryItemProps) {

    return (
        <div className="flex items-center justify-between border-b border-border transition-colors px-2 w-full">
            <div className="flex items-center gap-4">
                <Image
                    src={item.film.posterUrl || ''}
                    alt={item.film.title}
                    width={40}
                    height={56}
                    className='rounded-sm object-cover'
                />
                <Link
                    href={`/film/${item.film.slug}`}
                    className='font-semibold hover:text-primary text-foreground'
                >
                    {item.film.title}
                </Link>
            </div>
            <div className="flex items-center gap-4 text-muted">
                {item.rating > 0 && (
                    <StarRating value={item.rating} isReadonly size='sm' />
                )}
                {item.isLiked && (
                    <HeartIcon
                        size={16}
                        className='text-destructive'
                        fill='currentColor'
                    />
                )}
                {item.hasReview && (
                    <MessageSquareIcon size={16} className='text-accent'/>
                )}
            </div>
        </div>
    )
}