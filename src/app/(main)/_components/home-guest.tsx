import {LatestDiaryItem} from "@/server/types/diary";
import {DiscoverFilmItem} from "@/server/types/film";
import {SectionHeader} from "@/components/shared/section-header";
import {FilmCard} from "@/components/shared/film-card";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";

interface Props {
    activities: LatestDiaryItem[]
    popularFilms: DiscoverFilmItem[]
}

export function HomeGuest({activities, popularFilms}: Props) {
    const heroFilm = popularFilms[0]

    return (
        <div className='bg-background'>
            {heroFilm && <HomeHero film={heroFilm} />}
            <div className="max-w-275 mx-auto px-4 relative z-20">
                <section className='mb-12'>
                    <SectionHeader title="Новое на Letterboxd"/>

                    <div className="grid grid-cols-6 gap-3">
                        {activities.map((activity, index) => (
                            <FilmCard
                                key={index}
                                film={activity.film}
                                user={activity.user}
                                rating={activity.rating}
                                watchedAt={activity.watchedAt}
                                variant='activity'
                            />
                        ))}
                    </div>
                </section>

                <section className="mb-12">
                    <SectionHeader title='Популярно на этой неделе' href='/films'/>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {popularFilms.map((film) => (
                            <FilmCard
                                key={film.id}
                                film={{
                                    id: film.id,
                                    title: film.title,
                                    slug: film.slug,
                                    posterUrl: film.posterUrl
                                }}
                                variant='poster'
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

function HomeHero({film}: { film: DiscoverFilmItem }) {
    return (
        <section
            className='relative w-full h-[80vh] min-h-150 flex items-center justify-center overflow-hidden bg-background'>
            {film.bannerUrl && (
                <Image
                    src={film.bannerUrl}
                    alt={film.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-5000 ease-out hover:scale-105"
                    style={{
                        maskImage: 'linear-gradient(to bottom, black 0%, black 20%, transparent 95%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 20%, transparent 95%)'
                    }}
                />
            )}

            {/*<div*/}
            {/*    className="absolute inset-0 bg-linear-to-b from-background via-transparent to-transparent h-1/3 opacity-80"/>*/}
            {/*<div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent"/>*/}
            {/*<div className="absolute bottom-0 left-0 right-0 h-24 bg-background"/>*/}
            {/*<div className="absolute inset-0 bg-linear-to-r from-background/40 via-transparent to-background/40"/>*/}

            <div
                className='relative z-10 w-full max-w-275 mx-auto flex flex-col items-center justify-center text-center px-4 pt-20'>
                <h1 className="text-4xl md:text-6xl font-bold font-serif text-white tracking-tight mb-6 drop-shadow-2xl leading-[1.1]">
                    Отмечай то, что посмотрел.
                    <br/>
                    Сохраняй то, что ждешь.
                    <br/>
                    Делись тем, что любишь.
                </h1>

                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-medium drop-shadow-lg">
                    Сообщество тех, кто живет кинематографом. Сегодня в тренде -
                    {' '}
                    <Link
                        href={`/film/${film.slug}`}
                        className='text-white font-semibold border-b border-primary/50'
                    >
                        {film.title} ({film.year})
                    </Link>
                </p>

                <Button size='lg'>
                    <Link href='/register'>Присоединиться</Link>
                </Button>
            </div>
        </section>
    )
}