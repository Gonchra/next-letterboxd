import {z} from "zod";

export const getUserDiarySchema = z.object({
    username: z.string().min(1),
    limit: z.number().int().positive().default(6)
})

export const getLatestDiarySchema = z.object({
    limit: z.number().int().positive().default(6).optional()
})

export const logFilmSchema = z.object({
    filmId: z.string().min(1),
    rating: z.number().min(0).max(5),
    review: z.string(),
    liked: z.boolean()
})