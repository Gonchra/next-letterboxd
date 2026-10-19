import {authClient} from "@/lib/tools/auth-client";
import {headers} from "next/headers";
import {getLatestDiaryAction} from "@/server/actions/diary";
import {discoverFilmsAction} from "@/server/actions/film";
import {HomeGuest} from "@/app/(main)/_components/home-guest";
import {HomeDashboard} from "@/app/(main)/_components/home-dashboard";

export default async function HomePage() {
    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        }
    })

    const user = session?.data?.user
    const isGuest = !user

    const [diaryResult, popularResult] = await Promise.all([
        getLatestDiaryAction({}),
        discoverFilmsAction({
            sortBy: 'popularity',
            period: 'week',
            limit: 6
        })
    ])

    const activities = diaryResult?.data || []
    const popularFilms = popularResult?.data?.items || []

    if(isGuest) {
        return <HomeGuest activities={activities} popularFilms={popularFilms} />
    }

    return (
        <HomeDashboard username={user.username!} activities={activities} popularFilms={popularFilms} />
    )
}