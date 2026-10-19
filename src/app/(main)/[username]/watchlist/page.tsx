import {Metadata} from "next";
import {discoverFilmsAction} from "@/server/actions/film";
import {EmptyState} from "@/components/shared/empty-state";
import {FilmCard} from "@/components/shared/film-card";
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface Props {
    params: Promise<{username: string}>
    searchParams: Promise<{page?: string}>
}

const LIMIT = 18

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {username} = await params

    return {
        title: `Фильмы @${username}`,
        description: `Список фильмов, которые пользователь @${username} добавил в закладки на Letterboxd.`
    }
}

export default async function WatchlistPage({params, searchParams}: Props) {
    const {username} = await params
    const {page} = await searchParams

    const currentPage = Number(page ?? '1')

    const filmsResult = await discoverFilmsAction({
        username,
        filterType: 'watchlist',
        limit: LIMIT,
        cursor: currentPage,
    })

    const items = filmsResult?.data?.items ?? []
    const hasMore = items.length === LIMIT

    if(items.length === 0) {
        return <EmptyState message='Список закладок пока пуст.' />
    }

    const basePath = `/${username}/watchlist`

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6">
                {items.map((film) => (
                    <FilmCard key={film.slug} film={film} variant='poster'/>
                ))}
            </div>

            <div className="flex items-center justify-between mt-8">
                {currentPage > 1 ? (
                    <Button variant='outline' size='sm'>
                        <Link href={`${basePath}?page=${currentPage - 1}`}>
                            Назад
                        </Link>
                    </Button>
                ) : (
                    <div />
                )}

                {hasMore && (
                    <Button variant='outline' size='sm'>
                        <Link href={`${basePath}?page=${currentPage + 1}`}>
                            Вперед
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    )
}