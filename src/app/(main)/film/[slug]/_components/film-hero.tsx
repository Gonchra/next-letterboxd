import {FilmDetails} from "@/server/types/film";
import Image from "next/image";

interface FilmHeroProps {
    film: FilmDetails
}

export function FilmHero({film}: FilmHeroProps) {

    return (
        <div className='absolute inset-0 w-full h-125 overflow-hidden'>
            <Image
                src={film.bannerUrl || ''}
                alt={film.title}
                fill
                priority
                className='object-cover object-top opacity-50'
            />
            <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/60 to-background" />
            <div className="absolute inset-0 bg-linear-to-r from-background via-background to-background opacity-40" />
        </div>
    )
}