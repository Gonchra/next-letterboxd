import {createSafeActionClient} from "next-safe-action";
import {authClient} from "@/lib/tools/auth-client";
import {headers} from "next/headers";

export const actionClient = createSafeActionClient()

export const authActionClient = actionClient.use(async ({next}) => {
    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        }
    })

    if (!session?.data?.user) {
        throw new Error('Session not found')
    }

    return next({ctx: {user: session.data.user}})
})