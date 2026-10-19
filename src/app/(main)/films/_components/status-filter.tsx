import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import Link from "next/link";

interface Props {
    currentFilterType?: string
    triggerStyles: string
    createFilterUrl: (updates: {
        filterType?: 'watchlist' | 'liked' | 'watched' | null
    }) => string
}

const filterTypeLabels: Record<string, string> = {
    watchlist: 'Буду смотреть',
    liked: 'Понравилось',
    watched: 'Просмотрено'
}

export function StatusFilter({triggerStyles, currentFilterType, createFilterUrl} : Props) {
    const currentFilterLabel = currentFilterType ? filterTypeLabels[currentFilterType] : 'Все фильмы'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={triggerStyles}>
                {currentFilterLabel}{' '}
                <ChevronDown className='size-3 opacity-50'/>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-48'>
                <DropdownMenuItem>
                    <Link href={createFilterUrl({filterType: null})}>
                        Все фильмы
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href={createFilterUrl({filterType: 'watchlist'})}>
                        Буду смотреть
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={createFilterUrl({filterType: 'liked'})}>
                        Понравилось
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={createFilterUrl({filterType: 'watched'})}>
                        Просмотрено
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}