import {FilmDetails} from "@/server/types/film";
import Image from "next/image";
import {Clock, Eye, Heart} from "lucide-react";
import {formatNumber} from "@/lib/utils/format-number";

interface FilmPosterProps {
    film: FilmDetails
}

export function FilmPoster({film}: FilmPosterProps) {
    return (
        <div className="col-span-3 space-y-4">
            <div className="relative aspect-2/3 w-full rounded-lg overflow-hidden shadow-3xl">
                <Image
                    src={film.posterUrl || ''}
                    alt={film.title}
                    fill
                    priority
                    className='object-cover'
                />
            </div>
            <div className="flex items-center justify-between px-2 text-muted text-xs uppercase tracking-wide">
                <div className="flex items-center gap-1.5">
                    <Eye className='size-4 text-green-500' />
                    {formatNumber(film.viewsCount)}
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className='size-4 text-blue-400' />
                    {formatNumber(film.watchlistCount)}
                </div>
                <div className="flex items-center gap-1.5">
                    <Heart className='size-4 text-orange-500 fill-orange-500' />
                    {formatNumber(film.likesCount)}
                </div>
            </div>
        </div>
    )
}