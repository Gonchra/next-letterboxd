import {DiaryEntity, FilmEntity, UserEntity} from "@/server/db/types";

export type UserDiaryItem = {
    id: string
    watchedAt: DiaryEntity['watchedAtDate']
    isRewatch: boolean
    user: Pick<UserEntity, 'id' | 'name' | 'username' | 'avatar'>
    film: Pick<FilmEntity, 'id' | 'title' | 'posterUrl' | 'slug'>
    rating: number
    isLiked: boolean
    hasReview: boolean
}

export type LatestDiaryItem = {
    id: string
    watchedAt: DiaryEntity['watchedAtDate']
    isRewatch: DiaryEntity['isRewatch']
    user: Pick<UserEntity, 'id' | 'name' | 'username' | 'avatar'>
    film: Pick<FilmEntity, 'id' | 'title' | 'posterUrl' | 'slug'>
    rating: number
    hasReview: boolean
}

export type LogFilmResponse = {
    success: boolean
}