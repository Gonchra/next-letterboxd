import {pgTable, primaryKey, text, timestamp} from "drizzle-orm/pg-core";
import {users} from "@/server/db/schema/users";
import {films} from "@/server/db/schema/films";
import {relations} from "drizzle-orm";

export const watchlist = pgTable('watchlist', {
    userId: text('user_id').notNull().references(() => users.id, {onDelete: 'cascade'}),
    filmId: text('film_id').notNull().references(() => films.id, {onDelete: 'cascade'}),
    addedAt: timestamp('added_at').defaultNow().notNull(),
}, (t) => [primaryKey({columns: [t.userId, t.filmId]})])

export const watchlistRelations = relations(watchlist, ({one}) => ({
    user: one(users, {fields: [watchlist.userId], references: [users.id]}),
    film: one(films, {fields: [watchlist.filmId], references: [films.id]})
}))