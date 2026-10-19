'use server'

import * as schema from '@/server/db/schema'
import {actionClient} from "@/lib/tools/safe-action"
import {db} from "@/server/db"
import {and, eq} from "drizzle-orm"
import {toggleWatchlistSchema} from "@/server/schemas/watchlist";
import {revalidatePath} from "next/cache";
import {ToggleWatchlistResponse} from "@/server/types/watchlist";

export const toggleWatchlistAction = actionClient
    .inputSchema(toggleWatchlistSchema)
    .action(async ({parsedInput}): Promise<ToggleWatchlistResponse> => {
        const {filmId, userId, filmSlug} = parsedInput

        const existingRecord = await db.query.watchlist.findFirst({
            where: and(
                eq(schema.watchlist.userId, userId),
                eq(schema.watchlist.filmId, filmId)
            )
        })

        let isAdded = false

        if (existingRecord) {
            await db.delete(schema.watchlist)
                .where(
                    and(
                        eq(schema.watchlist.userId, userId),
                        eq(schema.watchlist.filmId, filmId)
                    )
                )
        } else {
            await db.insert(schema.watchlist).values({userId, filmId})
            isAdded = true
        }

        revalidatePath(`/film/${filmSlug}`)

        return {isAdded}
    })