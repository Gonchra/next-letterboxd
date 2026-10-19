import {z} from "zod";

export const discoverySchema = z.object({
    search: z.string().optional(),
    genre: z.string().optional(),
    year: z.number().optional(),
    sortBy: z.enum(['rating', 'releaseDate', 'duration', 'popularity']).default('popularity'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    period: z.enum(['week', 'year', 'all']).default('all'),
    limit: z.number().default(20),
    cursor: z.number().default(0),
    username: z.string().optional(),
    filterType: z.enum(['watchlist', 'liked', 'watched']).optional()
})

export const getFilmBySlugSchema = z.object({
    slug: z.string().min(1),
    currentUserId: z.string().optional()
})