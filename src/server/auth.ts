import {betterAuth} from "better-auth";
import {username} from "better-auth/plugins";
import {drizzleAdapter} from "@better-auth/drizzle-adapter";
import {db} from "@/server/db";
import * as schema from "@/server/db/schema"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verification
        }
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6
    },
    plugins: [username({displayUsernameNormalization: false})]
})