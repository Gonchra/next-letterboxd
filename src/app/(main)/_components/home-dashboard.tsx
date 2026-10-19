import {LatestDiaryItem} from "@/server/types/diary";
import {DiscoverFilmItem} from "@/server/types/film";
import Link from "next/link";
import {SectionHeader} from "@/components/shared/section-header";
import {FilmCard} from "@/components/shared/film-card";

interface Props {
    username: string
    activities: LatestDiaryItem[]
    popularFilms: DiscoverFilmItem[]
}

export function HomeDashboard({username, activities, popularFilms}: Props) {
    return (
        <div className="max-w-275 mx-auto px-4 pt-30 relative z-20">
            <div className="text-center pb-10">
                <h1 className="text-3xl text-muted leading-tight">
                    Рады видеть тебя, {' '}
                    <Link
                        href={`/${username}`}
                        className="text-foreground border-b-2 border-muted pb-0.5 hover:border-foreground cursor-pointer transition"
                    >
                        {username}
                    </Link>
                    . Вот что сейчас смотрят в сообществе...
                </h1>
                <p className="text-sm text-muted-foreground mt-4 tracking-wide font-normal max-w-2xl mx-auto leading-relaxed">
                    Исследуй общую ленту Letterboxd - от культовой классики до забытых шедевров.
                </p>
            </div>

            <section className="mb-12">
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
                <SectionHeader title='Популярно на этой неделе' href='/films' rightLabel='Больше'/>
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
                            priority
                        />
                    ))}
                </div>
            </section>
        </div>
    )
}