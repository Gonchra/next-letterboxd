'use server'

import {actionClient, authActionClient} from "@/lib/tools/safe-action";
import {getLatestDiarySchema, getUserDiarySchema, logFilmSchema} from "@/server/schemas/diary";
import {LatestDiaryItem, LogFilmResponse, UserDiaryItem} from "@/server/types/diary";
import {db} from "@/server/db";
import {diary, reviews, watchlist} from "@/server/db/schema";
import {and, eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";

export const getUserDiaryAction = actionClient
    .inputSchema(getUserDiarySchema)
    .action(async ({parsedInput}): Promise<UserDiaryItem[]> => {
        const {username, limit} = parsedInput

        const user = await db.query.users.findFirst({
            where: (user, {eq}) => eq(user.username, username),
            columns: {id: true}
        })

        if (!user) {
            return []
        }

        const activities = await db.query.diary.findMany({
            limit,
            where: (d, {eq, and, isNotNull}) => and(eq(d.userId, user.id), isNotNull(d.reviewId)),
            orderBy: (d, {desc}) => [desc(d.createdAt)],
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        username: true,
                        avatar: true
                    }
                },
                film: {
                    columns: {
                        id: true,
                        title: true,
                        posterUrl: true,
                        slug: true
                    }
                },
                review: {
                    columns: {
                        id: true,
                        rating: true,
                        content: true,
                        isLiked: true
                    }
                }
            }
        })

        return activities.map((item) => ({
            id: item.id,
            watchedAt: item.watchedAtDate,
            isRewatch: item.isRewatch,
            user: item.user,
            film: item.film,
            rating: item.review?.rating ?? 0,
            isLiked: !!item.review?.isLiked,
            hasReview: !!item.review?.content && item.review.content.trim().length > 0
        }))
    })

export const getLatestDiaryAction = actionClient
    .inputSchema(getLatestDiarySchema)
    .action(async ({parsedInput}): Promise<LatestDiaryItem[]> => {
        const {limit} = parsedInput

        const activities = await db.query.diary.findMany({
            limit,
            where: (d, {isNotNull}) => isNotNull(d.reviewId),
            orderBy: (d, {desc}) => [desc(d.createdAt)],
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        username: true,
                        avatar: true
                    }
                },
                film: {
                    columns: {
                        id: true,
                        title: true,
                        posterUrl: true,
                        slug: true
                    }
                },
                review: {
                    columns: {
                        id: true,
                        rating: true,
                        content: true,
                        isLiked: true
                    }
                }
            }
        })

        return activities.map((item) => ({
            id: item.id,
            watchedAt: item.watchedAtDate,
            isRewatch: item.isRewatch,
            user: item.user,
            film: item.film,
            rating: item.review?.rating ?? 0,
            hasReview: !!item.review?.content?.trim()
        }))
    })

export const logFilmAction = authActionClient
    .inputSchema(logFilmSchema)
    .action(async ({parsedInput, ctx}): Promise<LogFilmResponse> => {
        const {filmId, rating, review, liked} = parsedInput

        const film = await db.query.films.findFirst({
            where: (f, {eq}) => eq(f.id, filmId),
            columns: {slug: true}
        })

        if (!film) {
            throw new Error('Film notfound')
        }

        const previousEntry = await db.query.diary.findFirst({
            where: (d, {eq, and}) => and(eq(d.userId, ctx.user.id), eq(d.filmId, filmId))
        })

        const isRewatch = !!previousEntry

        await db
            .delete(watchlist)
            .where(
                and(
                    eq(watchlist.userId, ctx.user.id),
                    eq(watchlist.filmId, filmId)
                )
            )

        const [newReview] = await db
            .insert(reviews)
            .values({
                id: crypto.randomUUID(),
                userId: ctx.user.id,
                filmId,
                rating,
                content: review,
                isLiked: liked
            }).returning()

        await db.insert(diary).values({
            id: crypto.randomUUID(),
            userId: ctx.user.id,
            filmId,
            watchedAtDate: new Date().toISOString(),
            isRewatch,
            reviewId: newReview.id
        })

        revalidatePath(`/film/${film.slug}`)

        return {success: true}
    })