import {pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {movieCast, movieCrew} from "@/server/db/schema/films";

export const persons = pgTable('persons', {
    id: text('id').primaryKey(),
    slug: varchar('slug', {length: 255}).notNull().unique(),
    name: text('name').notNull(),
    photoUrl: text('photo_url'),
    bio: text('bio'),
    createdAt: timestamp('created_at').defaultNow().notNull()
})

export const personsRelations = relations(persons, ({many})=> ({
    actingRoles: many(movieCast),
    crewRoles: many(movieCrew)
}))