import {Metadata} from "next";
import {authClient} from "@/lib/tools/auth-client";
import {headers} from "next/headers";
import {discoverFilmsAction} from "@/server/actions/film";
import {Container} from "@/components/shared/container";
import {SectionHeader} from "@/components/shared/section-header";
import {EmptyState} from "@/components/shared/empty-state";
import {FilmCard} from "@/components/shared/film-card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {FilmsFilter} from "@/app/(main)/films/_components/films-filter";

interface Props {
    params: Promise<{ segments?: string[] }>
    searchParams: Promise<{ page?: string }>
}

function parseSegments(segments: string[] = []) {
    let year: number | undefined = undefined
    let genre: string | undefined = undefined
    let sortBy: 'rating' | 'releaseDate' | 'duration' | 'popularity' = 'popularity'
    let sortOrder: 'asc' | 'desc' = 'desc'
    let period: 'week' | 'year' | 'all' = 'all'
    let filterType: 'watchlist' | 'liked' | 'watched' | undefined = undefined

    for (let i = 0; i < segments.length; i++) {
        if (segments[i] === 'filterType' && segments[i + 1]) {
            if (['watchlist', 'liked', 'watched'].includes(segments[i + 1])) {
                filterType = segments[i + 1] as any
            }
            i++
        } else if (segments[i] === 'year' && segments[i + 1]) {
            year = Number(segments[i + 1]) || undefined
            i++
        } else if (segments[i] === 'genre' && segments[i + 1]) {
            genre = segments[i + 1]
            i++
        } else if (segments[i] === 'sort' && segments[i + 1]) {
            const [by, order] = segments[i + 1].split('-')

            if (
                ['rating', 'releaseDate', 'duration', 'popularity'].includes(by)
            ) {
                sortBy = by as any
            }
            if (['asc', 'desc'].includes(order)) {
                sortOrder = order as any
            }
        } else if (segments[i] === 'period' && segments[i + 1]) {
            if (['week', 'year', 'all'].includes(segments[i + 1])) {
                period = segments[i + 1] as any
            }
        }
    }

    return {year, genre, sortBy, sortOrder, period, filterType}
}

function buildPath(parsed: ReturnType<typeof parseSegments>) {
    const path: string[] = []

    if (parsed.filterType) {
        path.push('filterType', parsed.filterType)
    }
    if (parsed.year) {
        path.push('year', String(parsed.year))
    }
    if (parsed.genre) {
        path.push('genre', parsed.genre)
    }
    if (parsed.sortBy !== 'popularity' || parsed.sortOrder !== 'desc') {
        path.push('sort', `${parsed.sortBy}-${parsed.sortOrder}`)
    }
    if (parsed.period !== 'all' && parsed.sortBy === 'popularity') {
        path.push('period', parsed.period)
    }

    return path.length > 0 ? `/films/${path.join('/')}` : '/films'
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {segments = []} = await params
    let parsed = parseSegments(segments)

    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        }
    })

    if (!session?.data?.user) {
        parsed.filterType = undefined
    }

    let title = 'Фильмы'
    let description = 'Каталог фильмов на Letterboxd.'

    if (parsed.filterType === 'watchlist') {
        title = 'Буду смотреть'
    }
    if (parsed.filterType === 'watched') {
        title = 'Просмотренное'
    }
    if (parsed.filterType === 'liked') {
        title = 'Любимые фильмы'
    }

    if (parsed.year) {
        title += ` ${parsed.year} года`
        description += ` Открывайте для себя лучшие кинокартины за ${parsed.year} год.`
    }

    if (parsed.sortBy === 'rating') {
        title += ' (Высокий рейтинг)'
    }
    if (parsed.sortBy === 'popularity' && !parsed.filterType) {
        title += ' (Популярные)'
    }

    return {
        title: `${title} - смотреть список на Letterboxd`,
        description: `${description} Оценивайте увиденное и делитесь мнением с друзьями.`
    }
}

export default async function FilmsPage({params, searchParams}: Props) {
    const resolvedParams = await params
    const resolvedSearchParams = await searchParams

    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        }
    })

    const user = session?.data?.user
    const isGuest = !user

    const segments = resolvedParams.segments ?? []
    const currentPage = Number(resolvedSearchParams.page) || 1
    const limit = 44

    const rawFilters = parseSegments(segments)

    const currentFilters = {
        ...rawFilters,
        filterType: isGuest ? undefined : rawFilters.filterType
    }

    const filmsResult = await discoverFilmsAction({
        ...currentFilters,
        ...(!isGuest && {username: user?.username ?? undefined}),
        limit: limit,
        cursor: (currentPage - 1) * limit
    })

    const items = filmsResult?.data?.items ?? []
    const hasMore = items.length === limit

    const basePath = buildPath(currentFilters)

    return (
        <Container
            className='flex flex-col pt-30 pb-10'
        >
            <SectionHeader title='Фильмы'>
                <FilmsFilter isGuest={isGuest} currentFilters={currentFilters}/>
            </SectionHeader>

            {items.length === 0 ? (
                <EmptyState message='Ничего не найдено'/>
            ) : (
                <div
                    className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-11 gap-x-2 gap-y-5">
                    {items.map((film) => (
                        <FilmCard key={film.id} film={film} variant='poster'/>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between mt-8">
                {currentPage > 1 ? (
                    <Button variant='outline' size='sm'>
                        <Link href={`${basePath}?page=${currentPage - 1}`}>
                            Назад
                        </Link>
                    </Button>
                ) : (
                    <div/>
                )}

                {hasMore && (
                    <Button variant='outline' size='sm'>
                        <Link href={`${basePath}?page=${currentPage + 1}`}>
                            Вперед
                        </Link>
                    </Button>
                )}
            </div>
        </Container>
    )
}