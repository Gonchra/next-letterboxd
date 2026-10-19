import {Metadata} from "next";
import {getUserByUsernameAction, getUserStatsAction} from "@/server/actions/user";
import {ReactNode} from "react";
import {notFound} from "next/navigation";
import {Container} from "@/components/shared/container";
import {ProfileHeader} from "@/app/(main)/[username]/_components/profile-header";

interface Props {
    children: ReactNode
    params: Promise<{ username: string }>
}

export async function generateMetadate({params}: Props): Promise<Metadata> {
    const {username} = await params

    const userResult = await getUserByUsernameAction({username})
    const user = userResult.data

    if (!user) {
        return {
            title: 'Пользователь не найден'
        }
    }

    const title = `${user.name} (@${user.username})`
    const description = `Смотрите дневник просмотров и рецензии на фильмы пользователя ${user.name} (@${user.username}) на Letterboxd.`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://letterboxd.com/${user.username}`,
            images: [
                {
                    url: user.avatar ?? '/default-avatar.png',
                    width: 800,
                    height: 800,
                    alt: `Аватар пользователя ${user.name}`
                },
            ],
            type: 'profile',
            username: user.username
        },
        twitter: {
            card: 'summary',
            title,
            description,
            images: [
                {
                    url: user.avatar ?? '/default-avatar.png',
                    width: 800,
                    height: 800,
                    alt: `Аватар пользователя ${user.name}`
                },
            ],
        },
        alternates: {
            canonical: `https://letterboxd.com/${user.username}`
        }
    }
}

export default async function ProfileLayout({children, params}: Props) {
    const {username} = await params

    const [userResult, statsResult] = await Promise.all([
        getUserByUsernameAction({username}),
        getUserStatsAction({username})
    ])

    const user = userResult.data
    const stats = statsResult.data

    if (!user) {
        notFound()
    }

    return (
        <Container className="flex flex-col gap-8 py-16">
            <ProfileHeader user={user} stats={stats!} />
            <section className='animate-in fade-in duration-500'>
                {children}
            </section>
        </Container>
    )

}