import {Metadata} from "next";
import {getFilmBySlugAction} from "@/server/actions/film";
import {authClient} from "@/lib/tools/auth-client";
import {headers} from "next/headers";
import {notFound} from "next/navigation";
import {FilmHero} from "@/app/(main)/film/[slug]/_components/film-hero";
import {Container} from "@/components/shared/container";
import {FilmPoster} from "@/app/(main)/film/[slug]/_components/film-poster";
import Link from "next/link";
import {FilmActions} from "@/app/(main)/film/[slug]/_components/film-actions";
import {SectionHeader} from "@/components/shared/section-header";
import {FilmCast} from "@/app/(main)/film/[slug]/_components/film-cast";
import {FilmReviews} from "@/app/(main)/film/[slug]/_components/film-reviews";

interface Props {
    params: Promise<{slug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug} = await params
    const {data: film} = await getFilmBySlugAction({slug})

    if(!film) {
        return {}
    }

    return {
        title: `${film.title} (${film.year})`,
        description: film.description,
        openGraph: {
            images: [film.posterUrl ?? '']
        }
    }
}

export default async function FilmPage({params}: Props) {
    const {slug} = await params

    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        }
    })

    const user = session?.data?.user

    const {data: film} = await getFilmBySlugAction({
        slug,
        ...(user && {currentUserId: user?.id})
    })

    if(!film) {
        return notFound()
    }

    const directors = film.crew.filter((member) => member.job === 'Director') || []

    return (
        <main className="min-h-screen pb-20">
            <FilmHero film={film} />

            <Container className="mt-48 relative z-10">
                <div className="grid grid-cols-12 gap-8">
                    <FilmPoster film={film} />

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
                            <span>Режиссер: </span>
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
                            <p className='text-lg leading-relaxed text-foreground/90'>
                                {film.description}
                            </p>

                            {user && (
                                <FilmActions film={film} userId={user.id} />
                            )}

                            <div>
                                <SectionHeader title='Актерский состав' />
                                <FilmCast cast={film.cast} />
                            </div>

                            <div>
                                <SectionHeader title='Отзывы' />
                                <FilmReviews reviews={film.reviews} />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    )
}