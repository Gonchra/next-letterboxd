import {boolean, doublePrecision, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {users} from "@/server/db/schema/users";
import {films} from "@/server/db/schema/films";
import {relations} from "drizzle-orm";
import {diary} from "@/server/db/schema/diary";

export const reviews = pgTable('reviews', {
    id: text('id').primaryKey(),
    content: text('content').notNull(),
    rating: doublePrecision('rating').notNull(),
    isLiked: boolean('is_liked').default(false).notNull(),
    userId: text('user_id').notNull().references(() => users.id, {onDelete: 'cascade'}),
    filmId: text('film_id').notNull().references(() => films.id, {onDelete: "cascade"}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
})

export const reviewsRelations = relations(reviews, ({one, many}) => ({
    user: one(users, {fields: [reviews.userId], references: [users.id]}),
    film: one(films, {fields: [reviews.filmId], references: [films.id]}),
    diaryEntries: many(diary)
}))