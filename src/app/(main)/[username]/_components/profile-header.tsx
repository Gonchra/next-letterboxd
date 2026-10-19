'use client'

import {PublicUser, UserStatsResponse} from "@/server/types/user";
import {usePathname} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getInitials} from "@/lib/utils/get-initials";
import Link from "next/link";
import {cn} from "@/lib/utils/cn";

const PROFILE_TABS = [
    {name: 'Профиль', href: '/'},
    {name: 'Фильмы', href: '/films'},
    {name: 'Дневник', href: '/diary'},
    {name: 'Буду смотреть', href: '/watchlist'},
    {name: 'Любимые', href: '/likes'},
]

interface Props {
    user: PublicUser
    stats: UserStatsResponse
}

export function ProfileHeader({user, stats}: Props) {
    const pathname = usePathname()

    const displayStats = [
        {label: 'Фильмы', value: stats?.total ?? 0},
        {label: 'В этом году', value: stats?.year ?? 0},
        {label: 'На этой неделе', value: stats?.week ?? 0},
    ]

    return (
        <div className="w-full font-sans text-foreground">
            <div className="container mx-auto py-6.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4.5">
                        <Avatar className="size-24">
                            <AvatarImage src={user.avatar!}/>
                            <AvatarFallback className="text-2xl">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-5">
                                <h1 className="text-2xl font-semibold text-foreground">
                                    {user.name}
                                </h1>
                                <p className="text-sm text-muted">
                                    @{user.username}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end gap-4.5 text-center">
                        {displayStats.map((stat, index) => (
                            <div key={index} className="flex flex-col">
                            <span className='text-3xl font-medium tracking-tighter text-foreground font-serif'>
                                {stat.value}
                            </span>
                                <span
                                    className='text-[10px] uppercase tracking-[0.12em] font-sans text-foreground/60 mt-1'>
                                {stat.label}
                            </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto">
                <div className="flex items-center justify-center border border-border bg-transparent rounded-sm px-6">
                    <nav className="flex items-center gap-6.5">
                        {PROFILE_TABS.map((tab) => {
                            const isActive = tab.href === '/' ? pathname === `/${user.username}` : pathname.includes(tab.href)

                            return (
                                <Link
                                    key={tab.name}
                                    href={`/${user.username}${tab.href}`}
                                    className={cn(
                                        'py-3.5 text-[15px] tracking-wide border-b-2 transition-colors',
                                        isActive ? 'border-primary text-foreground' : 'border-transparent text-muted hover:text-foreground'
                                    )}
                                >
                                    {tab.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>
        </div>
    )
}