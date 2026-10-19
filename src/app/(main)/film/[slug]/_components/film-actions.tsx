'use client'

import {FilmDetails} from "@/server/types/film";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {PenLine} from "lucide-react";
import {LogFilmDialog} from "@/app/(main)/film/[slug]/_components/log-film-dialog";
import {WatchlistButton} from "@/app/(main)/film/[slug]/_components/toggle-watchlist-button";

interface FilmActionsProps {
    film: FilmDetails
    userId: string
}

export function FilmActions({film, userId}: FilmActionsProps) {
    const [isLogOpen, setIsLogOpen] = useState(false)

    return (
        <>
            <div className='flex items-center gap-3 flex-wrap'>
                <WatchlistButton film={film} userId={userId} />
                <Button
                    onClick={() => setIsLogOpen(true)}
                    variant='outline'
                    className='gap-2'
                >
                    <PenLine/>
                    Добавить в дневник
                </Button>
            </div>

            <LogFilmDialog
                isOpen={isLogOpen}
                onOpenChange={setIsLogOpen}
                film={film}
            />
        </>
    )
}