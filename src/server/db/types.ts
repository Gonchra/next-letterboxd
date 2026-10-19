import {InferSelectModel} from "drizzle-orm";
import {
    diary,
    films,
    movieCast,
    movieCrew,
    reviews,
    users,
    watchlist
} from "./schema";


export type DiaryEntity = InferSelectModel<typeof diary>
export type FilmEntity = InferSelectModel<typeof films>
export type CastEntity = InferSelectModel<typeof movieCast>
export type CrewEntity = InferSelectModel<typeof movieCrew>
export type UserEntity = InferSelectModel<typeof users>
export type ReviewEntity = InferSelectModel<typeof reviews>
export type WatchlistEntity = InferSelectModel<typeof watchlist>
