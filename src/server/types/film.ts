import {CastEntity, CrewEntity, FilmEntity} from "@/server/db/types";

export interface DiscoverFilmItem {
    id: string
    title: string
    slug: string
    posterUrl: string | null
    bannerUrl: string | null
    year: number | null
    rating: number | null
    duration: number | null
    popularityScore: number
}

export interface DiscoverFilmsResponse {
    items: DiscoverFilmItem[]
    nextCursor: number | null
}

export interface FilmDetails extends FilmEntity {
    viewsCount: number
    watchlistCount: number
    likesCount: number
    averageRating: number
    cast: (CastEntity & {
        person: {
            id: string
            name: string
        }
    })[]
    crew: (CrewEntity & {
        person: {
            id: string
            name: string
        }
    })[]
    reviews: {
        id: string
        createdAt: Date | string
        rating: number
        content: string
        user: {
            id: string
            username: string | null
            avatar: string | null
        }
    }[]
    isInWatchlist: boolean
}