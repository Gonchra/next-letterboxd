import {formatDate} from "@/lib/utils/format-date";
import {cn} from "@/lib/utils/cn";
import Link from "next/link";
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getInitials} from "@/lib/utils/get-initials";
import {StarRating} from "@/components/shared/star-rating";

interface Props {
    film: {
        id: string
        title: string
        slug: string
        posterUrl: string | null
    }
    variant?: 'poster' | 'activity'
    rating?: number | null
    watchedAt?: string
    user?: {
        id: string
        name: string
        username: string | null
        avatar: string | null
    }
    priority?: boolean
    className?: string
}

export function FilmCard({
                             film,
                             user,
                             priority,
                             rating,
                             variant = 'poster',
                             watchedAt,
                             className
                         }: Props) {
    const isActivity = variant === 'activity'

    const formattedDate = watchedAt ? new Date(watchedAt).toLocaleDateString('ru-RU', {
        month: 'short',
        day: 'numeric'
    }) : null

    return (
        <div className={cn('group flex flex-col w-full', className)}>
            <Link
                href={isActivity ? `/${user?.username}` : `/film/${film.slug}`}
                className={cn(
                    'relative flex flex-col rounded-md overflow-hidden border-2 border-[#2c3440] transition-all duration-100 shadow-md bg-[#2c3440]',
                    'group-hover:border-primary'
                )}
            >
                <div className="relative aspect-2/3 w-full">
                    <Image
                        src={film.posterUrl!}
                        alt={film.title}
                        fill
                        priority={priority}
                        sizes='(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw'
                        className='object-cover'
                    />
                </div>

                {isActivity && user && (
                    <div className="flex items-center gap-2 p-2 bg-[#2c3440] border-t border-white/5">
                        <Avatar className="size-5 border border-white/10">
                            <AvatarImage src={user.avatar ?? ''} />
                            <AvatarFallback className='text-[8px]'>
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-[11px] text-[#9ab] font-medium group-hover:text-white truncate">
                            {user.name}
                        </span>
                    </div>
                )}
            </Link>

            {isActivity && (
                <div className="flex items-center justify-between mt-1.5 px-0.5">
                    <StarRating value={rating!} isReadonly size='sm' />
                    {formattedDate && (
                        <span className='text-[10px] text-[#678] font-medium uppercase tracking-wider'>
                            {formattedDate}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}