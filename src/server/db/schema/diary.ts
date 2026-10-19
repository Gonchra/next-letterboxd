import {boolean, date, index, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {users} from "@/server/db/schema/users";
import {films} from "@/server/db/schema/films";
import {reviews} from "@/server/db/schema/reviews";
import {relations} from "drizzle-orm";

export const diary = pgTable('diary', {
        id: text('id').primaryKey(),
        watchedAtDate: date('watched_at_date').notNull(),
        isRewatch: boolean('is_rewatch').default(false).notNull(),
        userId: text('user_id').notNull().references(() => users.id, {onDelete: "cascade"}),
        filmId: text('film_id').notNull().references(() => films.id, {onDelete: "cascade"}),
        reviewId: text('review_id').references(() => reviews.id, {onDelete: 'cascade'}),
        createdAt: timestamp('created_at').defaultNow().notNull()
    }, (table) => ({
        filmIdx: index('diary_film_id_idx').on(table.filmId)
    })
)

export const diaryRelations = relations(diary, ({one}) => ({
    user: one(users, {fields: [diary.userId], references: [users.id]}),
    film: one(films, {fields: [diary.filmId], references: [films.id]}),
    review: one(reviews, {
        fields: [diary.reviewId],
        references: [reviews.id]
    })
}))