import {boolean, index, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {reviews} from "@/server/db/schema/reviews";
import {diary} from "@/server/db/schema/diary";
import {watchlist} from "@/server/db/schema/watchlist";

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    name: text("name").notNull(),
    username: varchar('username', {length: 50}).unique(),
    displayUsername: text('display_username'),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false),
    avatar: text('avatar'),
    image: text('image'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const usersRelations = relations(users, ({many, one}) => ({
    reviews: many(reviews),
    diaryEntries: many(diary),
    watchlist: many(watchlist),
}))

export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => users.id)
})

export const accounts = pgTable('accounts', {
    id: text("id").primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => users.id),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_toke_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);
