import {Metadata} from "next";
import {getUserDiaryAction} from "@/server/actions/diary";
import {EmptyState} from "@/components/shared/empty-state";
import {DiaryItem} from "@/app/(main)/[username]/diary/_components/diary-item";

interface Props {
    params: Promise<{username: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {username} = await params

    return {
        title: `Дневник пользователя @${username}`,
        description: `Хронология просмотренных фильмов и история просмотров пользователя @${username} на Letterboxd.`
    }
}

export default async function UserDiaryPage({params}: Props) {
    const {username} = await params
    const diaryResult = await getUserDiaryAction({username, limit: 20})
    const items = diaryResult?.data ?? []

    const monthYearFormatter = new Intl.DateTimeFormat('ru-RU', {
        month: 'long',
        year: 'numeric'
    })
    const dayFormatter = new Intl.DateTimeFormat('ru-RU', {day: '2-digit'})

    if(items.length) {
        return <EmptyState message='Дневник пока пуст.' />
    }

    let lastGroup = ''

    return (
        <div className="space-y-6">
            {items.map((item) => {
                const date = new Date(item.watchedAt)
                const group = monthYearFormatter.format(date)
                const showGroup = group !== lastGroup
                lastGroup = group
                
                return (
                    <div key={item.id}>
                        {showGroup && (
                            <div className="py-4 text-sm text-muted uppercase tracking-wider">
                                {group}
                            </div>
                        )}
                        
                        <div className="flex items-center gap-6">
                            <div className="bg-card rounded-md px-3 py-2 min-w-12 text-center">
                                <span className="text-lg font-medium text-muted-foreground">
                                    {dayFormatter.format(date)}
                                </span>
                            </div>
                            <DiaryItem item={item} />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}