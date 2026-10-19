import {getUserByUsernameAction} from "@/server/actions/user";
import {getUserDiaryAction} from "@/server/actions/diary";
import {discoverFilmsAction} from "@/server/actions/film";
import {notFound} from "next/navigation";
import {SectionHeader} from "@/components/shared/section-header";
import {FilmCard} from "@/components/shared/film-card";

export default async function ProfilePage({params}: { params: Promise<{ username: string }> }) {
    const {username} = await params

    const [userResult, recentActivityResult, watchlistResult] = await Promise.all([
        getUserByUsernameAction({username}),
        getUserDiaryAction({username, limit: 4}),
        discoverFilmsAction({
            filterType: 'watchlist',
            username,
            limit: 5,
        })
    ])

    const user = userResult.data
    const recentActivity = recentActivityResult.data || []
    const watchlist = watchlistResult.data?.items || []

    if (!user) {
        notFound()
    }

    return (
        <div className='flex flex-col md:flex-row gap-10'>
            <div className="flex-3 space-y-12">
                <div>
                    <SectionHeader title='Последние записи' href={`/${username}/diary`}/>
                    <div className="grid grid-cols-4 gap-4">
                        {recentActivity.map((activity, index) => (
                            <FilmCard film={activity.film} key={index} variant='poster' />
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="flex-1 space-y-10">
                {watchlist.length > 0 && (
                    <div>
                        <SectionHeader title='Watchlist' href={`/${username}/watchlist`}/>

                        <div className="flex relative h-30 w-full items-center">
                            {watchlist.map((film, index) => (
                                <div className="absolute" key={film.slug} style={{
                                    left: `${index * 43}px`,
                                    zIndex: watchlist.length - index
                                }}>
                                    <div className="w-20">
                                        <FilmCard film={film} variant='poster'/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}