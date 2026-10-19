import {FilmDetails} from "@/server/types/film";
import {ReactNode} from "react";
import Link from "next/link";

interface FilmInfoProps {
    film: FilmDetails
    children: ReactNode
}

export function FilmInfo({film, children}: FilmInfoProps) {
    const directors = film.crew.filter((member) => member.job === 'Director') || []

    return (
        <div className="col-span-9 pt-2">
            <div className="flex items-baseline gap-3 flex-wrap mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight text-balance font-serif">
                    {film.title}
                </h1>
                <Link
                    href={`/films/year/${film.year}`}
                    className='text-lg text-muted-foreground font-light shrink-0'
                >
                    {film.year}
                </Link>
            </div>

            <p className="text-muted mb-6 tracking-wider font-light">
                <span>Режисер:</span>
                {directors.length > 0 ? (
                    directors.map((d, index) => (
                        <span
                            key={d.personId}
                            className='text-foreground'
                        >
                                        <span>{d.person.name}</span>
                            {index < directors.length - 1 && ', '}
                                    </span>
                    ))
                ) : (
                    <span className="text-foreground">
                                    Не указан
                                </span>
                )}
            </p>

            <div className="space-y-8">
                <p className="text-lg leading-relaxed text-foreground/90">
                    {film.description}
                </p>

                {children}
            </div>
        </div>
    )
}