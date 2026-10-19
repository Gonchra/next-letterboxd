import {z} from "zod";

export const toggleWatchlistSchema = z.object({
    filmId: z.string().min(1),
    userId: z.string().min(1),
    filmSlug: z.string().min(1)
})