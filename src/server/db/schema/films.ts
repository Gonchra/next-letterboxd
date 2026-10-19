import {doublePrecision, integer, jsonb, pgTable, primaryKey, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {persons} from "@/server/db/schema/persons";
import {relations} from "drizzle-orm";
import {filmsToGenres} from "@/server/db/schema/genre";

export const films = pgTable('films', {
    id: text("id").primaryKey(),
    slug: varchar('slug', {length: 255}).notNull().unique(),
    title: text('title').notNull(),
    originalTitle: text('original_title'),
    alternativeTitles: jsonb('alternative_titles').$type<string[]>(),
    country: varchar('country'),
    year: integer('year'),
    duration: integer('duration'),
    description: text('description'),
    rating: doublePrecision('rating').default(0),
    posterUrl: text('poster_url'),
    bannerUrl: text('banner_url'),
    trailerUrl: text('trailer_url'),
    tmdbLink: text('tmdb_link'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const movieCast = pgTable(
    'movie_cast',
    {
        filmId: text('film_id').notNull().references(() => films.id, {onDelete: 'cascade'}),
        personId: text('person_id').notNull().references(() => persons.id, {onDelete: 'cascade'}),
        characterName: text('character_name'),
        order: integer('order').default(0)
    },
    (t) => [primaryKey({columns: [t.filmId, t.personId]})]
)

export const movieCrew = pgTable('movie_crew', {
        filmId: text('film_id').notNull().references(() => films.id, {onDelete: 'cascade'}),
        personId: text('person_id').notNull().references(() => persons.id, {onDelete: 'cascade'}),
        job: text('job').notNull()
    },
    (t) => [primaryKey({columns: [t.filmId, t.personId, t.job]})]
)

export const filmsRelations = relations(films, ({many}) => ({
    cast: many(movieCast),
    crew: many(movieCrew),
    genres: many(filmsToGenres)
}))

export const movieCastRelations = relations(movieCast, ({one}) => ({
    film: one(films, {fields: [movieCast.filmId], references: [films.id]}),
    person: one(persons, {fields: [movieCast.personId], references: [persons.id]})
}))

export const movieCrewRelations = relations(movieCrew, ({one}) => ({
    film: one(films, {fields: [movieCrew.filmId], references: [films.id]}),
    person: one(persons, {fields: [movieCrew.personId], references: [persons.id]})
}))