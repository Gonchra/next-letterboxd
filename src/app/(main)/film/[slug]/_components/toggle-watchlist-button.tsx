import {FilmDetails} from "@/server/types/film";
import {useOptimisticAction} from "next-safe-action/hooks";
import {toggleWatchlistAction} from "@/server/actions/watchlist";
import {Button} from "@/components/ui/button";
import {Bookmark} from "lucide-react";
import {cn} from "@/lib/utils/cn";

interface WatchlistButtonProps {
    film: FilmDetails
    userId: string
}

export function WatchlistButton({film, userId}: WatchlistButtonProps) {
    const initialIsAdded = !!film.isInWatchlist

    const {execute, optimisticState} = useOptimisticAction(
        toggleWatchlistAction,
        {
            currentState: {isInWatchlist: initialIsAdded},
            updateFn: (state) => ({isInWatchlist: !state.isInWatchlist})
        }
    )

    const handleToggle = () => {
        execute({filmId: film.id, userId, filmSlug: film.slug})
    }

    const isAdded = optimisticState.isInWatchlist

    return (
        <Button
            onClick={handleToggle}
            variant={isAdded ? 'default' : 'outline'}
            className='gap-2'
        >
            <Bookmark className={cn('size-4', isAdded && 'fill-current')}/>
            <span>{isAdded ? 'В закладках' : 'Буду смотреть'}</span>
        </Button>
    )
}