'use server'

import {actionClient} from "@/lib/tools/safe-action";
import {db} from "@/server/db";
import {and, eq, sql} from "drizzle-orm";
import {diary} from "@/server/db/schema";
import type {PublicUser, UserStatsResponse} from "@/server/types/user";
import {getUserByStatsSchema, getUserByUsernameSchema} from "@/server/schemas/user";

export const getUserByUsernameAction = actionClient
    .inputSchema(getUserByUsernameSchema)
    .action(
        async ({parsedInput: {username}}): Promise<PublicUser | null> => {
            const user = await db.query.users.findFirst({
                where: (users, {eq}) => eq(users.username, username)
            })

            return user ?? null
        }
    )

export const getUserStatsAction = actionClient
    .inputSchema(getUserByStatsSchema)
    .action(
        async ({
                   parsedInput: {username}
               }): Promise<UserStatsResponse | null> => {
            const user = await db.query.users.findFirst({
                where: (user, {eq}) => eq(user.username, username),
                columns: {id: true}
            })

            if (!user) {
                return null
            }

            const [totalFilms, yearFilms, weekFilms] = await Promise.all([
                db
                    .select({
                        count: sql`count(distinct
                        ${diary.filmId}
                        )`
                    })
                    .from(diary)
                    .where(eq(diary.userId, user.id)),

                db
                    .select({
                        count: sql`count(distinct
                        ${diary.filmId}
                        )`
                    })
                    .from(diary)
                    .where(
                        and(
                            eq(diary.userId, user.id),
                            sql`${diary.watchedAtDate}
                            >= date_trunc('year', now())`
                        )
                    ),

                db
                    .select({
                        count: sql`count(distinct
                        ${diary.filmId}
                        )`
                    })
                    .from(diary)
                    .where(
                        and(
                            eq(diary.userId, user.id),
                            sql`${diary.watchedAtDate}
                            >= date_trunc('week', now())`
                        )
                    )
            ])

            return {
                total: Number(totalFilms[0].count),
                year: Number(yearFilms[0].count),
                week: Number(weekFilms[0].count)
            }
        }
    )