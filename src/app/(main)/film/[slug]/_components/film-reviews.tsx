import {FilmDetails} from "@/server/types/film";
import {EmptyState} from "@/components/shared/empty-state";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getInitials} from "@/lib/utils/get-initials";
import {formatDate} from "@/lib/utils/format-date";
import {StarRating} from "@/components/shared/star-rating";
import {Separator} from "@/components/ui/separator";

interface FilmReviewsProps {
    reviews: FilmDetails['reviews']
}

export function FilmReviews({reviews}: FilmReviewsProps) {
    if (reviews.length === 0) {
        return <EmptyState message='Отзывов нет'/>
    }

    return (
        <div className='flex flex-col'>
            {reviews.map((review, index) => (
                <div key={review.id}>
                    <article className='py-6 flex flex-col gap-4'>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Avatar className='size-9 shrink-0'>
                                    <AvatarImage
                                        src={review.user.avatar ?? ''}
                                        alt={review.user.username!}
                                    />
                                    <AvatarFallback
                                        className='text-xs font-medium'
                                    >
                                        {getInitials(review.user.username!)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none text-foreground">
                                        {review.user.username}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDate(review.createdAt as string)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <StarRating
                                    value={review.rating}
                                    isReadonly
                                    size='sm'
                                />
                            </div>
                        </div>

                        <p className="text-sm leading-relaxed text-foreground/80 pl-12">
                            {review.content}
                        </p>
                    </article>

                    {index < reviews.length - 1 && <Separator /> }
                </div>
            ))}
        </div>
    )
}